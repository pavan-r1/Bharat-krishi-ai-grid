import os
import unittest
from datetime import timedelta
from unittest.mock import patch

from fastapi import HTTPException

from pydantic import ValidationError

from app.api import auth
from app.api.auth import LoginRequest, RegisterRequest, RegistrationOTPRequest, development_otp_enabled, generate_otp, login, normalize_phone, register, verify_challenge, verify_registration


class FakeCollection:
    def __init__(self, documents=()):
        self.documents = list(documents)

    def find_one(self, query):
        for document in self.documents:
            if all(document.get(key) == value for key, value in query.items()):
                return document
        return None

    def delete_one(self, query):
        self.documents = [document for document in self.documents if not all(document.get(key) == value for key, value in query.items())]

    def replace_one(self, query, replacement, upsert=False):
        self.delete_one(query)
        self.documents.append(dict(replacement))

    def update_one(self, query, update, upsert=False):
        doc = self.find_one(query)
        if not doc:
            if not upsert:
                return
            doc = dict(query)
            self.documents.append(doc)
        for key, value in update.get("$set", {}).items():
            doc[key] = value
        for key, value in update.get("$inc", {}).items():
            doc[key] = doc.get(key, 0) + value

    def insert_one(self, document):
        document = dict(document)
        document.setdefault("_id", f"id-{len(self.documents) + 1}")
        self.documents.append(document)
        class Result:
            inserted_id = document["_id"]
        return Result()


class FakeDatabase:
    def __init__(self, users):
        self.collections = {"users": FakeCollection(users), "auth_rate_limits": FakeCollection(), "otp_challenges": FakeCollection()}

    def __getitem__(self, collection):
        return self.collections.setdefault(collection, FakeCollection())


class RegistrationOtpTests(unittest.TestCase):
    def setUp(self):
        self.fake_db = FakeDatabase([])
        self.env = patch.dict(os.environ, {
            "APP_ENV": "testing", "DEV_OTP_ENABLED": "true",
            "OTP_SECRET": "test-otp-secret", "JWT_SECRET": "test-jwt-secret",
            "OTP_MAX_ATTEMPTS": "3", "OTP_TTL_MINUTES": "5",
            "OTP_RESEND_SECONDS": "60", "SMS_PROVIDER": "none",
        })
        self.env.start()
        self.addCleanup(self.env.stop)
        self.db_patch = patch.object(auth, "db", self.fake_db)
        self.db_patch.start()
        self.addCleanup(self.db_patch.stop)

    def _register(self):
        return register(RegisterRequest(name="Test Farmer", phone="9876543210", password="a-long-valid-password"))

    def _verify(self, otp):
        return verify_registration(RegistrationOTPRequest(phone="9876543210", otp=otp))

    def test_registration_creates_user_only_after_valid_development_otp(self):
        response = self._register()
        self.assertNotIn("otp", response)
        self.assertEqual(self.fake_db["users"].documents, [])
        challenge = self.fake_db["otp_challenges"].documents[0]
        self.assertEqual(len(challenge["otp_hash"]), 64)
        self.assertEqual(challenge["purpose"], "farmer_registration")
        result = self._verify("684291")
        self.assertEqual(result["message"], "Registration successful.")
        self.assertNotIn("access_token", result)
        self.assertNotIn("otp", response)
        self.assertNotIn("otp", result)
        self.assertTrue(self.fake_db["users"].documents[0]["phone_verified"])
        stored_user = self.fake_db["users"].documents[0]
        self.assertTrue(auth.password_hash.verify("a-long-valid-password", stored_user["password_hash"]))
        self.assertNotEqual(stored_user["password_hash"], "a-long-valid-password")
        login_result = login(LoginRequest(identifier="9876543210", password="a-long-valid-password"))
        self.assertTrue(login_result["otp_required"])
        self.assertEqual(login_result["identifier"], "+919876543210")
        with self.assertRaises(HTTPException) as error:
            self._register()
        self.assertEqual(error.exception.status_code, 409)

    def test_incorrect_otp_does_not_create_account(self):
        self._register()
        with self.assertRaises(HTTPException) as error:
            self._verify("000000")
        self.assertEqual(error.exception.status_code, 400)
        self.assertEqual(self.fake_db["users"].documents, [])
        self.assertEqual(self.fake_db["otp_challenges"].documents[0]["attempts"], 1)

    def test_registration_attempt_limit_is_enforced(self):
        self._register()
        with patch.object(auth, "OTP_MAX_ATTEMPTS", 3):
            for _ in range(3):
                with self.assertRaises(HTTPException) as error:
                    self._verify("000000")
                self.assertEqual(error.exception.status_code, 400)
            with self.assertRaises(HTTPException) as error:
                self._verify("684291")
            self.assertEqual(error.exception.status_code, 429)
        self.assertEqual(self.fake_db["users"].documents, [])

    def test_duplicate_phone_is_rejected_before_challenge_creation(self):
        self.fake_db["users"].documents.append({"phone": "+919876543210", "role": "farmer"})
        with self.assertRaises(HTTPException) as error:
            self._register()
        self.assertEqual(error.exception.status_code, 409)
        self.assertEqual(self.fake_db["otp_challenges"].documents, [])

    def test_production_registration_requires_sms_configuration(self):
        with patch.dict(os.environ, {"APP_ENV": "production", "DEV_OTP_ENABLED": "true", "SMS_PROVIDER": "none"}):
            with self.assertRaises(HTTPException) as error:
                self._register()
        self.assertEqual(error.exception.status_code, 503)
        self.assertEqual(self.fake_db["users"].documents, [])
        self.assertEqual(self.fake_db["otp_challenges"].documents, [])

    def test_development_registration_code_is_rejected_in_production(self):
        phone = "+919876543210"
        purpose = "farmer_registration"
        self.fake_db["otp_challenges"].documents.append({
            "_id": f"{purpose}:{phone}", "identifier": phone, "purpose": purpose,
            "otp_hash": auth.otp_digest(phone, purpose, "684291"),
            "development_otp": False, "expires_at": auth.now_utc() + timedelta(minutes=5),
            "attempts": 0,
        })
        with patch.dict(os.environ, {"APP_ENV": "production", "DEV_OTP_ENABLED": "false"}):
            with self.assertRaises(HTTPException) as error:
                verify_challenge(phone, purpose, "684291")
        self.assertEqual(error.exception.status_code, 400)
        self.assertEqual(self.fake_db["otp_challenges"].documents[0]["attempts"], 1)

    def test_registration_otp_schema_accepts_six_digits_only(self):
        self.assertEqual(RegistrationOTPRequest(phone="9876543210", otp="684291").otp, "684291")
        with self.assertRaises(Exception):
            RegistrationOTPRequest(phone="9876543210", otp="68421")


class PhoneAuthenticationTests(unittest.TestCase):
    def test_phone_inputs_normalize_to_indian_e164(self):
        for raw in ("9876543210", "919876543210", "+919876543210", "+91 98765 43210", "0091-98765-43210"):
            with self.subTest(raw=raw):
                self.assertEqual(normalize_phone(raw), "+919876543210")

    def test_invalid_phone_is_rejected(self):
        for raw in ("1234567890", "987654321", "+1 4155552671", "+91987654321099"):
            with self.subTest(raw=raw):
                with self.assertRaises(ValueError):
                    normalize_phone(raw)

    def test_registration_schema_normalizes_phone(self):
        request = RegisterRequest(name="Test Farmer", phone="+91 98765 43210", password="a-long-valid-password")
        self.assertEqual(request.phone, "+919876543210")

    def test_registration_requires_phone_and_login_has_no_role_input(self):
        with self.assertRaises(ValidationError):
            RegisterRequest(name="Test Farmer", email="farmer@example.in", password="a-long-valid-password")
        self.assertNotIn("role", LoginRequest.model_fields)

    def test_fixed_challenge_requires_explicit_nonproduction_environment(self):
        cases = (("production", "true", False), ("development", "false", False), ("development", "true", True), ("testing", "true", True))
        for app_env, enabled, expected in cases:
            with self.subTest(app_env=app_env, enabled=enabled), patch.dict(os.environ, {"APP_ENV": app_env, "DEV_OTP_ENABLED": enabled}):
                self.assertEqual(development_otp_enabled(), expected)

    def test_random_production_code_never_uses_the_development_code(self):
        with patch.dict(os.environ, {"APP_ENV": "production", "DEV_OTP_ENABLED": "true"}), patch.object(auth.secrets, "randbelow", side_effect=[int(auth._DEV_OTP), 123456]):
            self.assertEqual(generate_otp(), "123456")

    def test_development_code_is_generated_only_when_explicitly_enabled(self):
        with patch.dict(os.environ, {"APP_ENV": "testing", "DEV_OTP_ENABLED": "true"}):
            self.assertEqual(generate_otp(), auth._DEV_OTP)

    def test_farmer_phone_login_targets_verified_farmer_and_requests_sms(self):
        farmer = {"_id": "farmer-1", "name": "Test Farmer", "phone": "+919876543210", "phone_verified": True,
                  "role": "farmer", "password_hash": auth.password_hash.hash("a-long-valid-password")}
        fake_db = FakeDatabase([farmer])
        with patch.object(auth, "db", fake_db), patch.object(auth, "check_login_rate"), patch.object(auth, "issue_challenge") as issue:
            result = login(LoginRequest(identifier="98765 43210", password="a-long-valid-password"))
        self.assertEqual(result["channel"], "sms")
        self.assertEqual(result["identifier"], "+919876543210")
        self.assertEqual(issue.call_args.args[:3], ("+919876543210", "sms", "farmer_login"))

    def test_officer_email_login_remains_email_based(self):
        officer = {"_id": "officer-1", "name": "Test Officer", "email": "officer@example.in", "email_verified": True,
                   "role": "officer", "password_hash": auth.password_hash.hash("a-long-valid-password")}
        fake_db = FakeDatabase([officer])
        with patch.object(auth, "db", fake_db), patch.object(auth, "check_login_rate"), patch.object(auth, "issue_challenge") as issue:
            result = login(LoginRequest(identifier="OFFICER@example.in", password="a-long-valid-password"))
        self.assertEqual(result["channel"], "email")
        self.assertEqual(result["identifier"], "officer@example.in")
        self.assertEqual(issue.call_args.args[:3], ("officer@example.in", "email", "officer_login"))


class DevelopmentOfficerSeedTests(unittest.TestCase):
    def setUp(self):
        self.fake_db = FakeDatabase([])

    def test_explicit_development_seed_creates_hashed_officer_once(self):
        config = {
            "APP_ENV": "development", "DEV_OFFICER_ENABLED": "true",
            "DEV_OFFICER_EMAIL": "officer@bkig.local", "DEV_OFFICER_PASSWORD": "a-secure-development-password",
        }
        with patch.dict(os.environ, config), patch.object(auth, "db", self.fake_db):
            self.assertTrue(auth.seed_development_officer())
            self.assertFalse(auth.seed_development_officer())
        officer = self.fake_db["users"].find_one({"email": "officer@bkig.local"})
        self.assertEqual(officer["role"], "officer")
        self.assertTrue(officer["email_verified"])
        self.assertTrue(auth.password_hash.verify(config["DEV_OFFICER_PASSWORD"], officer["password_hash"]))

    def test_officer_seed_is_disabled_outside_explicit_development(self):
        config = {
            "APP_ENV": "production", "DEV_OFFICER_ENABLED": "true",
            "DEV_OFFICER_EMAIL": "officer@bkig.local", "DEV_OFFICER_PASSWORD": "a-secure-development-password",
        }
        with patch.dict(os.environ, config), patch.object(auth, "db", self.fake_db):
            self.assertFalse(auth.seed_development_officer())
        self.assertEqual(self.fake_db["users"].documents, [])


if __name__ == "__main__":
    unittest.main()
