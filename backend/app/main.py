
import os
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pymongo.errors import PyMongoError
from app.api.officer import router as officer_router
from app.database import check_database
from app.api.claims import router as claims_router
from app.api.assessment import router as assessment_router
from app.api.auth import router as auth_router
from app.services.market_data import router as mandi_router
from app.api.schemes import router as schemes_router
from app.api.chatbot import router as chatbot_router
from app.api.auth import seed_development_officer

logger = logging.getLogger(__name__)
app = FastAPI(
    title="BKIG API",
    description="AI-Powered Bharat Krishi Intelligence Grid",
    version="1.0.0",
)
app.include_router(auth_router)
app.include_router(mandi_router)
app.include_router(schemes_router)
app.include_router(chatbot_router)
app.include_router(assessment_router)
app.include_router(officer_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register the claims router AFTER creating the app
app.include_router(claims_router)


@app.exception_handler(PyMongoError)
async def database_error_handler(request: Request, exc: PyMongoError):
    return JSONResponse(status_code=503, content={"detail": "Database is temporarily unavailable."})


@app.on_event("startup")
def ensure_indexes():
    from app.database import db
    if db is not None:
        try:
            for index in db["users"].list_indexes():
                if index.get("key") == {"email": 1} and index.get("unique") and not index.get("partialFilterExpression"):
                    db["users"].drop_index(index["name"])
            db["users"].create_index("email", unique=True, partialFilterExpression={"email": {"$type": "string"}})
            db["users"].create_index("phone", unique=True, partialFilterExpression={"phone": {"$type": "string"}})
            db["insurance_claims"].create_index("claim_id", unique=True)
            db["insurance_claims"].create_index([("owner_id", 1), ("created_at", -1)])
            db["otp_challenges"].create_index("expires_at", expireAfterSeconds=0)
            db["revoked_tokens"].create_index("expires_at", expireAfterSeconds=0)
            db["auth_rate_limits"].create_index("expires_at", expireAfterSeconds=0)
        except Exception:
            # Startup stays available; persistence-dependent routes continue to fail closed.
            return
        try:
            if seed_development_officer():
                logger.info("Created the configured development-only officer account.")
        except Exception as exc:
            logger.error("Could not seed the development officer account (%s).", type(exc).__name__)


@app.get("/")
def root():
    return {
        "project": "AI-Powered Bharat Krishi Intelligence Grid",
        "status": "running",
    }


@app.get("/api/v1/health/database")
def database_health():
    return check_database()
