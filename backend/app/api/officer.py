
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.database import db
from app.api.auth import require_officer

router = APIRouter(
    prefix="/api/v1/officer",
    tags=["Officer Review"],
)


class ReviewInput(BaseModel):
    decision: str = Field(
        pattern="^(approved|rejected|needs_more_information)$",
        description="approved, rejected, or needs_more_information"
    )
    notes: str = Field(default="", max_length=2000)


@router.get("/claims")
def list_claims(user: dict = Depends(require_officer)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    claims = list(db["insurance_claims"].find({"is_demo": {"$ne": True}}, {"_id": 0, "evidence_photos.storage_key": 0}).sort("created_at", -1))

    return {"count": len(claims), "claims": claims}


@router.get("/claims/{claim_id}/assessments")
def get_assessments(claim_id: str, user: dict = Depends(require_officer)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    claim = db["insurance_claims"].find_one({"claim_id": claim_id, "is_demo": {"$ne": True}})

    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")

    predictions = list(
        db["model_predictions"]
        .find({"claim_id": claim_id}, {"_id": 0})
        .sort("created_at", -1)
    )

    return {
        "claim_id": claim_id,
        "assessment_count": len(predictions),
        "assessments": predictions,
    }


@router.post("/claims/{claim_id}/review")
def record_review(claim_id: str, review: ReviewInput, user: dict = Depends(require_officer)):
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")

    if review.decision in {"rejected", "needs_more_information"} and not review.notes.strip():
        raise HTTPException(status_code=422, detail="Notes are required for this decision.")

    claim = db["insurance_claims"].find_one({"claim_id": claim_id, "is_demo": {"$ne": True}})

    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")

    record = {
        "claim_id": claim_id,
        "decision": review.decision,
        "notes": review.notes,
        "reviewed_at": datetime.now(timezone.utc),
        "officer_id": str(user["_id"]),
    }

    result = db["officer_reviews"].insert_one(record)
    db["insurance_claims"].update_one({"claim_id": claim_id}, {"$set": {"status": review.decision, "officer_notes": review.notes}, "$push": {"timeline": {"status": review.decision, "title": f"Officer decision: {review.decision.replace('_', ' ')}", "date": datetime.now(timezone.utc).isoformat(), "note": review.notes}}})

    return {
        "review_id": str(result.inserted_id),
        "claim_id": claim_id,
        "decision": review.decision,
        "message": "Review recorded",
    }
