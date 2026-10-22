"""Phone-based farmer and email-based officer authentication with OTP verification."""
import base64
import hashlib
import hmac
import os
import re
import secrets
import smtplib
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from argon2 import PasswordHasher as Argon2Hasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from pydantic import BaseModel, Field, field_validator

from app.database import db

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
bearer = HTTPBearer(auto_error=False)
_argon2 = Argon2Hasher()
EMAIL_PATTERN = r"^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,63})+$"
OTP_TTL_MINUTES = int(os.getenv("OTP_TTL_MINUTES", "5"))
OTP_MAX_ATTEMPTS = int(os.getenv("OTP_MAX_ATTEMPTS", "5"))
OTP_RESEND_SECONDS = int(os.getenv("OTP_RESEND_SECONDS", "60"))
_DEV_OTP = "684291"


class PasswordHash:
    @staticmethod
    def hash(password: str) -> str:
        return _argon2.hash(password)

    @staticmethod
    def verify(password: str, encoded: str) -> bool:
        try:
            return _argon2.verify(encoded, password)
        except (InvalidHashError, VerificationError, VerifyMismatchError):
            return False


password_hash = PasswordHash()


def now_utc():
    return datetime.now(timezone.utc)


def normalize_email(email: str) -> str:
    return email.strip().lower()


def seed_development_officer() -> bool:
    """Create the explicitly configured local officer once; never reset existing accounts."""
    if os.getenv("APP_ENV", "production").lower() != "development" or os.getenv("DEV_OFFICER_ENABLED", "false").lower() != "true":
        return False
    if db is None:
        return False
    email = normalize_email(os.getenv("DEV_OFFICER_EMAIL", ""))
    password = os.getenv("DEV_OFFICER_PASSWORD", "")
    if not re.fullmatch(EMAIL_PATTERN, email) or len(password) < 16:
        raise ValueError("Development officer seeding requires a valid email and a password of at least 16 characters.")

    users = db["users"]
    existing = users.find_one({"email": email})
    if existing:
        if existing.get("role") == "officer":
            return False
        raise ValueError("Development officer email already belongs to a non-officer account.")
    user = {
        "name": "BKIG Development Officer",
        "email": email,
        "email_verified": True,
        "password_hash": password_hash.hash(password),
        "role": "officer",
        "created_at": now_utc(),
    }
    try:
        users.insert_one(user)
    except DuplicateKeyError:
        # Another worker may have created the same account during startup.
        if users.find_one({"email": email, "role": "officer"}):
            return False
        raise
    return True


def normalize_phone(phone: str) -> str:
    """Normalize Indian mobile numbers to E.164 (+91XXXXXXXXXX)."""
    digits = re.sub(r"[\s().-]", "", phone.strip())
    if digits.startswith("0091"):
        digits = digits[2:]
    if digits.startswith("+91"):
        digits = digits[1:]
    elif len(digits) == 10:
        digits = "91" + digits
    if not re.fullmatch(r"91[6-9]\d{9}", digits):
        raise ValueError("Enter a valid 10-digit Indian mobile number.")
    return "+" + digits


def collections():
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable.")
    return db["users"], db["otp_challenges"]


def check_login_rate(identifier: str, failed=False):
    attempts = db["auth_rate_limits"]
    key = {"_id": identifier}
    record = attempts.find_one(key)
    current = now_utc()
    started = record.get("window_started") if record else None
    if started and started.tzinfo is None:
        started = started.replace(tzinfo=timezone.utc)
    if not record or not started or (current - started).total_seconds() >= 900:
        record = {"_id": identifier, "window_started": current, "expires_at": current + timedelta(minutes=15), "failures": 0}
        attempts.replace_one(key, record, upsert=True)
    if record.get("failures", 0) >= 8:
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again later.")
    if failed:
        attempts.update_one(key, {"$inc": {"failures": 1}})


def otp_digest(identifier: str, purpose: str, code: str) -> str:
    secret = os.getenv("OTP_SECRET") or os.getenv("JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=503, detail="Authentication is not configured.")
    return hmac.new(secret.encode(), f"{identifier}:{purpose}:{code}".encode(), hashlib.sha256).hexdigest()


def development_otp_enabled() -> bool:
    return os.getenv("APP_ENV", "production").lower() in {"development", "testing"} and os.getenv("DEV_OTP_ENABLED", "false").lower() == "true"


def generate_otp(purpose: str | None = None) -> str:
    if development_otp_enabled():
        return _DEV_OTP
    code = f"{secrets.randbelow(1_000_000):06d}"
    while code == _DEV_OTP:
        code = f"{secrets.randbelow(1_000_000):06d}"
    return code


def send_otp_email(email: str, code: str, purpose: str):
    required = ("SMTP_FROM", "SMTP_USERNAME", "SMTP_PASSWORD")
    if not all(os.getenv(key) for key in required):
        raise HTTPException(status_code=503, detail="Email delivery is not configured.")
    msg = EmailMessage()
    msg["Subject"] = "Your BKIG verification code"
    msg["From"] = os.environ["SMTP_FROM"]
    msg["To"] = email
    msg.set_content(f"Your BKIG {purpose.replace('_', ' ')} code is {code}. It expires in {OTP_TTL_MINUTES} minutes. Do not share it.")
    try:
        with smtplib.SMTP(os.getenv("SMTP_HOST", "smtp.gmail.com"), int(os.getenv("SMTP_PORT", "587")), timeout=15) as smtp:
            smtp.starttls()
            smtp.login(os.environ["SMTP_USERNAME"], os.environ["SMTP_PASSWORD"].replace(" ", ""))
            smtp.send_message(msg)
    except Exception:
        raise HTTPException(status_code=503, detail="Email delivery failed. Please try again later.")


def send_otp_sms(phone: str, code: str, purpose: str):
    provider = os.getenv("SMS_PROVIDER", "none").strip().lower()
    if provider != "twilio":
        raise HTTPException(status_code=503, detail="SMS delivery is not configured. Set SMS_PROVIDER and valid provider credentials.")
    sid, token, sender = (os.getenv(key) for key in ("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"))
    if not all((sid, token, sender)):
        raise HTTPException(status_code=503, detail="SMS delivery is not configured. Set valid Twilio credentials and sender number.")
    endpoint = f"https://api.twilio.com/2010-04-01/Accounts/{urllib.parse.quote(sid)}/Messages.json"
    body = urllib.parse.urlencode({"To": phone, "From": sender, "Body": f"Your BKIG {purpose.replace('_', ' ')} code is {code}. It expires in {OTP_TTL_MINUTES} minutes."}).encode()
    auth = base64.b64encode(f"{sid}:{token}".encode()).decode()
    request = urllib.request.Request(endpoint, data=body, headers={"Authorization": f"Basic {auth}", "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            if response.status >= 300:
                raise ValueError("SMS provider rejected request")
    except Exception:
        raise HTTPException(status_code=503, detail="SMS provider delivery failed. Please try again later.")


def issue_challenge(identifier: str, channel: str, purpose: str, payload=None):
    _, challenges = collections()
    current = now_utc()
    key = {"_id": f"{purpose}:{identifier}"}
    existing = challenges.find_one(key)
    sent_at = existing.get("last_sent_at") if existing else None
    if sent_at:
        if sent_at.tzinfo is None:
            sent_at = sent_at.replace(tzinfo=timezone.utc)
        if (current - sent_at).total_seconds() < OTP_RESEND_SECONDS:
            raise HTTPException(status_code=429, detail="Please wait before requesting another OTP.")
    code = generate_otp(purpose)
    record = {**key, **(payload or {}), "identifier": identifier, "channel": channel, "purpose": purpose,
              "otp_hash": otp_digest(identifier, purpose, code), "development_otp": development_otp_enabled(),
              "expires_at": current + timedelta(minutes=OTP_TTL_MINUTES), "attempts": 0, "last_sent_at": current}
    challenges.replace_one(key, record, upsert=True)
    try:
        if not development_otp_enabled():
            if channel == "sms":
                send_otp_sms(identifier, code, purpose)
            else:
                send_otp_email(identifier, code, purpose)
    except HTTPException:
        challenges.delete_one(key)
        raise


def verify_challenge(identifier: str, purpose: str, code: str):
    _, challenges = collections()
    key = {"_id": f"{purpose}:{identifier}"}
    challenge = challenges.find_one(key)
    current = now_utc()
    expiry = challenge.get("expires_at") if challenge else None
    if expiry and expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if not challenge or not expiry or current >= expiry:
        challenges.delete_one(key)
        raise HTTPException(status_code=400, detail="OTP expired or invalid.")
    if challenge.get("attempts", 0) >= OTP_MAX_ATTEMPTS:
        challenges.delete_one(key)
        raise HTTPException(status_code=429, detail="Too many incorrect attempts. Request a new OTP.")
    expected_dev = development_otp_enabled()
    # Recheck the fixed-code gate at verification time. Turning the development
    # switch off immediately invalidates any outstanding development challenge.
    fixed_code_matches = expected_dev and challenge.get("development_otp") is True and hmac.compare_digest(code, _DEV_OTP)
    if not expected_dev and hmac.compare_digest(code, _DEV_OTP):
        challenges.update_one(key, {"$inc": {"attempts": 1}})
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    if challenge.get("development_otp") != expected_dev or not hmac.compare_digest(otp_digest(identifier, purpose, code), challenge["otp_hash"]):
        challenges.update_one(key, {"$inc": {"attempts": 1}})
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    if challenge.get("development_otp") and not fixed_code_matches:
        challenges.update_one(key, {"$inc": {"attempts": 1}})
        raise HTTPException(status_code=400, detail="Incorrect OTP.")
    challenges.delete_one(key)
    return challenge


def make_access_token(user: dict) -> str:
    secret = os.getenv("JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=503, detail="Authentication is not configured.")
    current = now_utc()
    return jwt.encode({"sub": str(user["_id"]), "role": user["role"], "jti": secrets.token_urlsafe(24), "iat": current,
                       "exp": current + timedelta(minutes=int(os.getenv("JWT_EXPIRE_MINUTES", "30")))},
                      secret, algorithm=os.getenv("JWT_ALGORITHM", "HS256"))


def public_user(user):
    response = {"id": str(user["_id"]), "name": user["name"], "email": user.get("email"), "phone": user.get("phone"), "role": user["role"]}
    if user.get("role") == "farmer" and user.get("device_location"):
        response["device_location"] = user["device_location"]
    return response


def session_response(user):
    return {"access_token": make_access_token(user), "token_type": "bearer", "user": public_user(user)}


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=10, max_length=18)
    password: str = Field(min_length=12, max_length=128)

    @field_validator("name")
    @classmethod
    def valid_name(cls, value):
        normalized = value.strip()
        if len(normalized) < 2:
            raise ValueError("Enter your full name.")
        return normalized

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        return normalize_phone(value)


class PhoneOTPRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=18)
    otp: str = Field(pattern=r"^\d{6}$")

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        return normalize_phone(value)


class RegistrationOTPRequest(BaseModel):
    phone: str = Field(min_length=10, max_length=18)
    otp: str = Field(pattern=r"^\d{6}$")

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        return normalize_phone(value)

class EmailOTPRequest(BaseModel):
    email: str = Field(pattern=EMAIL_PATTERN, max_length=254)
    otp: str = Field(pattern=r"^\d{6}$")


class LoginRequest(BaseModel):
    identifier: str = Field(min_length=1, max_length=254)
    password: str = Field(min_length=1, max_length=128)


class DeviceLocationInput(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    accuracy_meters: float | None = Field(default=None, ge=0, le=100000)


class UpgradePhoneRequest(BaseModel):
    email: str = Field(pattern=EMAIL_PATTERN, max_length=254)
    phone: str = Field(min_length=10, max_length=18)
    password: str = Field(min_length=1, max_length=128)

    @field_validator("phone")
    @classmethod
    def valid_phone(cls, value):
        return normalize_phone(value)


class ResendRequest(BaseModel):
    identifier: str = Field(min_length=1, max_length=254)
    purpose: str = Field(pattern="^(login|registration|upgrade)$")


def login_identity(identifier: str):
    users, _ = collections()
    if "@" in identifier:
        email = normalize_email(identifier)
        return email, "email", users.find_one({"email": email, "role": "officer"})
    try:
        phone = normalize_phone(identifier)
    except ValueError:
        raise HTTPException(status_code=422, detail="Enter a valid Indian mobile number or officer email address.")
    return phone, "sms", users.find_one({"phone": phone, "role": "farmer", "phone_verified": True})


@router.post("/register", status_code=202)
def register(data: RegisterRequest):
    users, _ = collections()
    if users.find_one({"phone": data.phone}):
        raise HTTPException(status_code=409, detail="An account already uses this phone number.")
    channel = "development" if development_otp_enabled() else "sms"
    issue_challenge(data.phone, channel, "farmer_registration", {"name": data.name.strip(), "password_hash": password_hash.hash(data.password), "role": "farmer"})
    return {"message": "Verification code sent to your phone." if not development_otp_enabled() else "Verification challenge created."}


@router.post("/register/verify")
def verify_registration(data: RegistrationOTPRequest):
    users, _ = collections()
    challenge = verify_challenge(data.phone, "farmer_registration", data.otp)
    if users.find_one({"phone": data.phone}):
        raise HTTPException(status_code=409, detail="An account already uses this phone number.")
    user = {"name": challenge["name"], "phone": data.phone, "password_hash": challenge["password_hash"], "role": "farmer", "phone_verified": True, "created_at": now_utc()}
    try:
        user["_id"] = users.insert_one(user).inserted_id
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An account already uses this phone number.")
    return {"message": "Registration successful."}


@router.post("/upgrade-phone", status_code=202)
def upgrade_legacy_farmer_phone(data: UpgradePhoneRequest):
    users, _ = collections()
    email = normalize_email(data.email)
    user = users.find_one({"email": email, "role": "farmer", "email_verified": True, "is_demo": {"$ne": True}, "phone": {"$exists": False}})
    if not user or not password_hash.verify(data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Existing farmer account could not be verified.")
    if users.find_one({"phone": data.phone}):
        raise HTTPException(status_code=409, detail="An account already uses this phone number.")
    issue_challenge(data.phone, "sms", "farmer_phone_upgrade", {"user_id": user["_id"], "email": email})
    message = "Verification challenge created." if development_otp_enabled() else "Verification code sent to your phone."
    return {"message": message}


@router.post("/upgrade-phone/verify")
def verify_legacy_farmer_phone(data: PhoneOTPRequest):
    users, _ = collections()
    challenge = verify_challenge(data.phone, "farmer_phone_upgrade", data.otp)
    result = users.update_one(
        {"_id": challenge.get("user_id"), "email": challenge.get("email"), "role": "farmer", "email_verified": True, "is_demo": {"$ne": True}, "phone": {"$exists": False}},
        {"$set": {"phone": data.phone, "phone_verified": True, "phone_verified_at": now_utc()}},
    )
    if result.modified_count != 1:
        raise HTTPException(status_code=409, detail="This account could not be updated. The phone may already belong to another account.")
    user = users.find_one({"_id": challenge["user_id"]})
    return {"message": "Phone number verified.", **session_response(user)}


@router.post("/login", status_code=202)
def login(data: LoginRequest):
    users, _ = collections()
    identifier, channel, user = login_identity(data.identifier)
    check_login_rate(identifier)
    valid_account = bool(user and ((user.get("role") == "farmer" and user.get("phone_verified")) or (user.get("role") == "officer" and user.get("email_verified"))))
    if not valid_account or not password_hash.verify(data.password, user.get("password_hash", "")):
        check_login_rate(identifier, failed=True)
        raise HTTPException(status_code=401, detail="Invalid account identifier or password.")
    db["auth_rate_limits"].delete_one({"_id": identifier})
    purpose = "farmer_login" if channel == "sms" else "officer_login"
    issue_challenge(identifier, channel, purpose, {"user_id": user["_id"]})
    return {"otp_required": True, "identifier": identifier, "channel": channel}


class VerifyLoginRequest(BaseModel):
    identifier: str = Field(min_length=1, max_length=254)
    otp: str = Field(pattern=r"^\d{6}$")


@router.post("/login/verify-otp")
def verify_login_otp(data: VerifyLoginRequest):
    identifier, channel, _ = login_identity(data.identifier)
    purpose = "farmer_login" if channel == "sms" else "officer_login"
    challenge = verify_challenge(identifier, purpose, data.otp)
    users, _ = collections()
    query = {"_id": challenge.get("user_id"), "role": "farmer", "phone": identifier, "phone_verified": True} if channel == "sms" else {"_id": challenge.get("user_id"), "role": "officer", "email": identifier, "email_verified": True}
    user = users.find_one(query)
    if not user:
        raise HTTPException(status_code=401, detail="Login could not be verified.")
    return session_response(user)


@router.post("/resend-otp", status_code=202)
def resend_otp(data: ResendRequest):
    users, challenges = collections()
    if data.purpose in {"registration", "upgrade"}:
        try:
            identifier = normalize_phone(data.identifier)
        except ValueError:
            raise HTTPException(status_code=422, detail="Enter a valid Indian mobile number.")
        purpose, channel = ("farmer_registration" if data.purpose == "registration" else "farmer_phone_upgrade"), "sms"
    else:
        identifier, channel, user = login_identity(data.identifier)
        purpose = "farmer_login" if channel == "sms" else "officer_login"
        if not user:
            return {"message": "If an active verification request exists, a new code has been sent."}
    existing = challenges.find_one({"_id": f"{purpose}:{identifier}"})
    if existing:
        carried = {key: existing[key] for key in ("name", "password_hash", "role", "user_id") if key in existing}
        issue_challenge(identifier, channel, purpose, carried)
    if development_otp_enabled():
        return {"message": "If an active verification request exists, its challenge has been refreshed."}
    return {"message": "If an active verification request exists, a new code has been sent."}


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required.", headers={"WWW-Authenticate": "Bearer"})
    try:
        secret = os.getenv("JWT_SECRET")
        if not secret:
            raise ValueError("Missing secret")
        payload = jwt.decode(credentials.credentials, secret, algorithms=[os.getenv("JWT_ALGORITHM", "HS256")])
        user_id = payload.get("sub")
        token_id = payload.get("jti")
        if not user_id or not token_id:
            raise ValueError("Invalid subject")
    except (jwt.JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token.", headers={"WWW-Authenticate": "Bearer"})
    users, _ = collections()
    if db["revoked_tokens"].find_one({"_id": token_id}):
        raise HTTPException(status_code=401, detail="Session has ended.")
    user = users.find_one({"_id": ObjectId(user_id)}) if ObjectId.is_valid(user_id) else users.find_one({"_id": user_id})
    verified = user and ((user.get("role") == "farmer" and user.get("phone_verified")) or (user.get("role") == "officer" and user.get("email_verified")))
    if not verified:
        raise HTTPException(status_code=401, detail="User is unavailable.")
    return user


def require_farmer(user=Depends(get_current_user)):
    if user.get("role") != "farmer":
        raise HTTPException(status_code=403, detail="Farmer access required.")
    return user


def require_officer(user=Depends(get_current_user)):
    if user.get("role") != "officer":
        raise HTTPException(status_code=403, detail="Officer access required.")
    return user


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return public_user(user)


@router.patch("/me/location")
def update_device_location(data: DeviceLocationInput, user=Depends(get_current_user)):
    if user.get("role") != "farmer":
        raise HTTPException(status_code=403, detail="Only farmer accounts can share device location.")
    if db is None:
        raise HTTPException(status_code=503, detail="Database is unavailable.")
    location = {
        "latitude": round(data.latitude, 6),
        "longitude": round(data.longitude, 6),
        "accuracy_meters": round(data.accuracy_meters, 1) if data.accuracy_meters is not None else None,
        "captured_at": now_utc(),
        "sharing_context": "farmer_login",
    }
    result = db["users"].update_one(
        {"_id": user["_id"], "role": "farmer"},
        {"$set": {"device_location": location}},
    )
    if result.matched_count != 1:
        raise HTTPException(status_code=404, detail="Farmer account not found.")
    return {"device_location": location}


@router.post("/logout", status_code=204)
def logout(credentials: HTTPAuthorizationCredentials = Depends(bearer), user=Depends(get_current_user)):
    payload = jwt.decode(credentials.credentials, os.environ["JWT_SECRET"], algorithms=[os.getenv("JWT_ALGORITHM", "HS256")])
    db["revoked_tokens"].update_one({"_id": payload["jti"]}, {"$set": {"expires_at": datetime.fromtimestamp(payload["exp"], timezone.utc)}}, upsert=True)
    return None
