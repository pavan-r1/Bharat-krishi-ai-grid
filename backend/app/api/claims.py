
from datetime import datetime, timezone
from uuid import uuid4
from pathlib import Path
import secrets
import re

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from app.database import db
from app.api.auth import require_farmer, get_current_user

router = APIRouter(prefix="/api/v1/insurance/claims", tags=["Insurance Claims"])
UPLOAD_DIR = Path(__file__).resolve().parents[2] / "private_uploads"
MAX_EVIDENCE_BYTES = 5 * 1024 * 1024


def public_claim(claim):
    claim.pop("_id", None)
    if claim.get("latest_assessment"):
        claim["ai_assessment"] = claim["latest_assessment"]
    for item in claim.get("evidence_photos", []):
        item.pop("storage_key", None)
    return claim


class ClaimCreate(BaseModel):
    farmer_name: str = Field(min_length=2, max_length=100)
    farmer_id: str | None = Field(default=None, max_length=100)
    crop: str = Field(min_length=1, max_length=100)
    district: str = Field(min_length=1, max_length=100)
    claimed_amount: float = Field(gt=0)
    area_hectares: float = Field(default=1, gt=0, le=10000)
    crop_variety: str = ""
    taluk: str = ""
    village: str = ""
    survey_number: str = ""
    state: str = ""
    incident_date: str = ""
    sowing_date: str = ""
    claim_reason: str = ""


@router.post("/", status_code=201)
def create_claim(claim: ClaimCreate, user: dict = Depends(require_farmer)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")

    document = claim.model_dump()
    document["farmer_id"] = str(user["_id"])
    document["farmer_name"] = user["name"]
    document["owner_id"] = str(user["_id"])
    if user.get("device_location"):
        # Copy the consented, server-stored login location into this claim's evidence record.
        document["device_location_at_submission"] = dict(user["device_location"])
    document.pop("is_demo", None)
    document.update({
        "claim_id": str(uuid4()),
        "status": "submitted",
        "created_at": datetime.now(timezone.utc),
        "timeline": [{"status": "submitted", "title": "Claim submitted", "date": datetime.now(timezone.utc).isoformat(), "note": "Submission received."}],
    })

    result = db["insurance_claims"].insert_one(document)
    document["_id"] = str(result.inserted_id)
    return document


@router.get("/")
def list_claims(user: dict = Depends(get_current_user)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")

    query = {"is_demo": {"$ne": True}}
    if user.get("role") == "farmer":
        query["owner_id"] = str(user["_id"])
    claims = [public_claim(c) for c in db["insurance_claims"].find(query, {"_id": 0}).sort("created_at", -1)]
    return {"count": len(claims), "claims": claims}


@router.get("/{claim_id}")
def get_claim(claim_id: str, user: dict = Depends(get_current_user)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")
    claim = db["insurance_claims"].find_one({"claim_id": claim_id, "is_demo": {"$ne": True}}, {"_id": 0})
    if not claim or (user.get("role") == "farmer" and claim.get("owner_id") != str(user["_id"])):
        raise HTTPException(status_code=404, detail="Claim not found")
    claim["review_history"] = list(db["officer_reviews"].find({"claim_id": claim_id}, {"_id": 0}).sort("reviewed_at", -1))
    if user.get("role") == "officer":
        previous_claims = {"owner_id": claim.get("owner_id"), "claim_id": {"$ne": claim_id}, "is_demo": {"$ne": True}}
        if claim.get("created_at"):
            previous_claims["created_at"] = {"$lt": claim["created_at"]}
        claim["prior_claims_count"] = db["insurance_claims"].count_documents(previous_claims)
    return public_claim(claim)


@router.post("/{claim_id}/evidence", status_code=201)
async def upload_evidence(claim_id: str, file: UploadFile = File(...), user: dict = Depends(require_farmer)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")
    claim = db["insurance_claims"].find_one({"claim_id": claim_id, "owner_id": str(user["_id"]), "is_demo": {"$ne": True}})
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if len(claim.get("evidence_photos", [])) >= 5:
        raise HTTPException(status_code=413, detail="A maximum of five evidence files is allowed.")
    data = await file.read(MAX_EVIDENCE_BYTES + 1)
    if len(data) > MAX_EVIDENCE_BYTES:
        raise HTTPException(status_code=413, detail="Evidence files must be 5 MB or smaller.")
    mime_to_ext = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
    ext = mime_to_ext.get(file.content_type or "")
    valid = ((ext == ".jpg" and data.startswith(b"\xff\xd8\xff")) or
             (ext == ".png" and data.startswith(b"\x89PNG\r\n\x1a\n")) or
             (ext == ".webp" and len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP"))
    if not valid:
        raise HTTPException(status_code=415, detail="Upload a valid JPG, PNG, or WebP image.")
    evidence_id = secrets.token_urlsafe(18)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    stored_name = f"{secrets.token_hex(24)}{ext}"
    (UPLOAD_DIR / stored_name).write_bytes(data)
    metadata = {"id": evidence_id, "name": re.sub(r"[^A-Za-z0-9._ -]", "_", (file.filename or "evidence")[:120]),
                "size_bytes": len(data), "content_type": file.content_type,
                "url": f"/api/v1/insurance/claims/{claim_id}/evidence/{evidence_id}"}
    updated = db["insurance_claims"].update_one(
        {"claim_id": claim_id, "owner_id": str(user["_id"]), "is_demo": {"$ne": True},
         "$expr": {"$lt": [{"$size": {"$ifNull": ["$evidence_photos", []]}}, 5]}},
        {"$push": {"evidence_photos": {**metadata, "storage_key": stored_name}}},
    )
    if updated.modified_count != 1:
        (UPLOAD_DIR / stored_name).unlink(missing_ok=True)
        raise HTTPException(status_code=413, detail="The claim already has the maximum five evidence files.")
    return metadata


@router.get("/{claim_id}/evidence/{evidence_id}")
def get_evidence(claim_id: str, evidence_id: str, user: dict = Depends(get_current_user)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database is not configured")
    query = {"claim_id": claim_id, "is_demo": {"$ne": True}}
    if user.get("role") == "farmer":
        query["owner_id"] = str(user["_id"])
    elif user.get("role") != "officer":
        raise HTTPException(status_code=403, detail="Access denied.")
    claim = db["insurance_claims"].find_one(query)
    evidence = next((item for item in claim.get("evidence_photos", []) if item.get("id") == evidence_id), None) if claim else None
    path = UPLOAD_DIR / evidence["storage_key"] if evidence and evidence.get("storage_key") else None
    if not path or not path.is_file():
        raise HTTPException(status_code=404, detail="Evidence not found")
    return FileResponse(path, media_type=evidence["content_type"])
