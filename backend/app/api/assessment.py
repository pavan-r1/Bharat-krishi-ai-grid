
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database import db
from app.services.fraud_service import assess_claim
from app.api.auth import get_current_user

router = APIRouter(
    prefix="/api/v1/insurance/claims",
    tags=["Fraud Risk Assessment"],
)


class AssessmentInput(BaseModel):
    area_hectares: float = Field(gt=0, le=10000)
    rainfall_mm: float = Field(ge=0, le=5000)
    previous_claims: int = Field(ge=0, le=1000)
    weather_match: int = Field(ge=0, le=1)
    source_notes: str = Field(min_length=10, max_length=2000)


@router.post("/{claim_id}/assessment")
def create_assessment(claim_id: str, inputs: AssessmentInput, user: dict = Depends(get_current_user)):
    if db is None:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured",
        )

    claim = db["insurance_claims"].find_one({"claim_id": claim_id, "is_demo": {"$ne": True}})

    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    if user.get("role") == "farmer" and claim.get("owner_id") != str(user["_id"]):
        raise HTTPException(status_code=404, detail="Claim not found")

    try:
        result = assess_claim(
            claimed_amount=float(claim["claimed_amount"]),
            area_hectares=inputs.area_hectares,
            rainfall_mm=inputs.rainfall_mm,
            previous_claims=inputs.previous_claims,
            weather_match=inputs.weather_match,
        )
    except Exception:
        raise HTTPException(status_code=503, detail="Risk assessment model is unavailable.")

    assessed_at = datetime.now(timezone.utc)
    result["assessed_at"] = assessed_at
    result["inputs"] = inputs.model_dump(exclude={"source_notes"})
    result["source_notes"] = inputs.source_notes.strip()
    prediction = {
        "claim_id": claim_id,
        "assessment": result,
        "inputs": inputs.model_dump(),
        "created_at": assessed_at,
        "assessed_by": str(user["_id"]),
    }

    saved = db["model_predictions"].insert_one(prediction)
    db["insurance_claims"].update_one({"claim_id": claim_id}, {"$set": {"latest_assessment": result, "risk_score": result["risk_score"], "risk_level": result["risk_category"]}})

    return {
        "prediction_id": str(saved.inserted_id),
        "claim_id": claim_id,
        "assessment": result,
        "review_status": "requires_human_review",
    }
