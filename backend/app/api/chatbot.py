"""BKIG agricultural assistant endpoint. Chat content is never persisted or logged."""
import asyncio
import os
import re
import threading
import time
from collections import defaultdict, deque
from datetime import date, datetime
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field, field_validator
from fastapi.security import HTTPAuthorizationCredentials

from app.api.auth import bearer, get_current_user
from app.api.schemes import SCHEMES
from app.database import db
from app.services import market_data
from app.services.gemini_service import GeminiConfigurationError, GeminiRequestError, generate_answer
from app.services.local_chat_fallback import detect_language, local_reply

router = APIRouter(prefix="/api/v1/chatbot", tags=["BKIG AI Assistant"])
_rate_lock = threading.Lock()
_requests_by_client = defaultdict(deque)
_MAX_REQUESTS_PER_MINUTE = 15
_MAX_HISTORY_TURNS = 8


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    text: str = Field(min_length=1, max_length=1500)

    @field_validator("text")
    @classmethod
    def trim_text(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Conversation messages cannot be blank.")
        return value


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=_MAX_HISTORY_TURNS)
    language: Literal["auto", "en", "kn", "hi"] = "auto"

    @field_validator("message")
    @classmethod
    def trim_message(cls, value):
        value = value.strip()
        if not value:
            raise ValueError("Enter a question to continue.")
        return value


class ChatResponse(BaseModel):
    answer: str
    model: str
    fallback: bool = False


def _rate_limit(client_key: str):
    now = time.monotonic()
    with _rate_lock:
        requests = _requests_by_client[client_key]
        while requests and now - requests[0] >= 60:
            requests.popleft()
        if len(requests) >= _MAX_REQUESTS_PER_MINUTE:
            raise HTTPException(status_code=429, detail="Too many assistant requests. Please wait a minute and try again.")
        requests.append(now)
        if len(_requests_by_client) > 10_000:
            for key in list(_requests_by_client)[:2_000]:
                if not _requests_by_client[key]:
                    del _requests_by_client[key]


def _redact_sensitive(text: str) -> str:
    patterns = (
        (r"(?i)\b(?:password|passcode|api[ -]?key|access token|jwt)\s*(?:is|:|=)\s*\S+", "[redacted credential]"),
        (r"\b(?:AIza[A-Za-z0-9_-]{20,}|AQ\.[A-Za-z0-9_-]{20,})\b", "[redacted API key]"),
        (r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}(?:\.[A-Za-z0-9_-]{8,})?\b", "[redacted token]"),
        (r"(?i)\b(?:otp|one[- ]time code|verification code)\s*(?:is|:|=)?\s*\d{4,8}\b", "[redacted code]"),
        (r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[redacted email]"),
        (r"(?<!\w)(?:\+?91[\s().-]*)?[6-9](?:[\s().-]*\d){9}(?!\w)", "[redacted phone]"),
    )
    for pattern, replacement in patterns:
        text = re.sub(pattern, replacement, text)
    return text


def _optional_user(credentials: HTTPAuthorizationCredentials | None):
    if credentials is None:
        return None
    return get_current_user(credentials)


def _claim_context(message: str, user: dict | None) -> str | None:
    if not re.search(r"\b(claim|claims|application)\b", message, re.IGNORECASE):
        return None
    if not re.search(r"\b(my|mine|status|track|tracking|update|progress|review|decision)\b", message, re.IGNORECASE):
        return None
    if user is None:
        return "Claim records are private. The user is not authenticated, so no claim record was accessed. Ask them to sign in to BKIG to check their own claim status."
    if user.get("role") != "farmer":
        return "The signed-in account is not a farmer account. Do not provide private farmer claim data."
    if db is None:
        return "The BKIG claims database is unavailable, so the user's claim status could not be verified."
    try:
        claims = list(db["insurance_claims"].find(
            {"owner_id": str(user["_id"]), "is_demo": {"$ne": True}},
            {"_id": 0, "claim_id": 1, "crop": 1, "status": 1, "created_at": 1},
        ).sort("created_at", -1).limit(5))
    except Exception:
        return "The BKIG claims database is unavailable, so the user's claim status could not be verified."
    if not claims:
        return "The authenticated farmer has no claims available in BKIG."
    compact = []
    for claim in claims:
        created = claim.get("created_at")
        if isinstance(created, (date, datetime)):
            created = created.isoformat()
        compact.append({"claim_id": claim.get("claim_id"), "crop": claim.get("crop"), "status": claim.get("status"), "created_at": created})
    return f"Verified claims owned by the authenticated farmer (most recent first): {compact!r}"


async def _mandi_context(message: str) -> str | None:
    if not re.search(r"\b(mandi|market price|market prices|price|prices|market comparison)\b", message, re.IGNORECASE):
        return None
    try:
        rows, source, is_live = await asyncio.to_thread(market_data.query_records, {}, 1000, 0)
    except HTTPException:
        return "BKIG has no mandi observations available for this request. Do not guess a current market price."
    except Exception:
        return "BKIG could not retrieve mandi observations for this request. Do not guess a current market price."

    stop_words = {"what", "which", "show", "tell", "about", "current", "latest", "today", "price", "prices", "market", "mandi", "compare", "comparison", "for", "the", "and", "crop"}
    terms = [term.casefold() for term in re.findall(r"[A-Za-z][A-Za-z-]{2,}", message) if term.casefold() not in stop_words]
    selected = []
    for row in rows:
        commodity = str(market_data.value(row, "commodity") or "")
        if commodity and (not terms or any(term in commodity.casefold() or commodity.casefold() in term for term in terms)):
            selected.append({
                "commodity": commodity,
                "state": market_data.value(row, "state") or "",
                "district": market_data.value(row, "district") or "",
                "market": market_data.value(row, "market") or "",
                "modal_price_rs_per_quintal": market_data.price_number(row, "modal_price", "modal price"),
                "arrival_date": market_data.value(row, "arrival_date", "arrival date") or "",
                "record_source": market_data.value(row, "record_source") or source,
                "record_source_url": market_data.value(row, "record_source_url") or market_data.SOURCE_URL,
            })
        if len(selected) >= 6:
            break
    if not selected:
        return f"BKIG has no matching observation in its available mandi records. Source: {market_data.SOURCE_URL}"
    status = "current daily Government of India AGMARKNET feed" if is_live else "dated CSV snapshot; not real-time"
    return f"Market observations from the {status} ({source}). Source: {market_data.SOURCE_URL}. Records: {selected!r}"


def _scheme_context(message: str) -> str | None:
    if not re.search(r"\b(scheme|schemes|subsidy|subsidies|government benefit|government programme|government program|PM-KISAN|PMFBY|SMAM|PMKSY)\b", message, re.IGNORECASE):
        return None
    terms = [term.casefold() for term in re.findall(r"[A-Za-z0-9-]{3,}", message)]
    matches = [scheme for scheme in SCHEMES if any(term in (scheme["title"] + " " + scheme["category"] + " " + scheme["id"]).casefold() for term in terms)]
    matches = matches[:4] if matches else SCHEMES[:4]
    official = [{"title": item["title"], "summary": item["summary"], "eligibility_guidance": item["eligibility"], "required_documents_guidance": item["documents"], "official_url": item["officialUrl"]} for item in matches]
    return f"BKIG's curated scheme directory and official portal links (check each source for current rules, deadlines, benefits, and document requirements; BKIG does not determine eligibility): {official!r}"


@router.post("/message", response_model=ChatResponse)
async def send_message(data: ChatRequest, request: Request, credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    client_host = request.client.host if request.client else "unknown"
    _rate_limit(client_host)
    user = _optional_user(credentials)
    message = _redact_sensitive(data.message)
    history = [{"role": turn.role, "text": _redact_sensitive(turn.text)} for turn in data.history[-_MAX_HISTORY_TURNS:]]
    language = detect_language(data.message, data.language)
    context_parts = []
    claim_data = _claim_context(data.message, user)
    if claim_data:
        context_parts.append(claim_data)
    mandi_data = await _mandi_context(data.message)
    if mandi_data:
        context_parts.append(mandi_data)
    scheme_data = _scheme_context(data.message)
    if scheme_data:
        context_parts.append(scheme_data)
    try:
        answer, model = await generate_answer(message, history, "\n\n".join(context_parts), language)
    except GeminiConfigurationError as exc:
        return ChatResponse(answer=local_reply(data.message, language), model="local-fallback", fallback=True)
    except GeminiRequestError as exc:
        return ChatResponse(answer=local_reply(data.message, language), model="local-fallback", fallback=True)
    return ChatResponse(answer=answer, model=model)
