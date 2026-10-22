# BKIG backend

FastAPI service backed by MongoDB. The bundled fraud model is trained on synthetic data; its score is experimental and must never be used as proof of fraud or as the sole basis for a claim decision.

## Local Windows setup

From the repository root:

```powershell
if (!(Test-Path backend\.env)) { Copy-Item backend\.env.example backend\.env }
notepad backend\.env # configure MongoDB, JWT/OTP secrets, SMTP, and SMS credentials
.\.venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
Set-Location backend
python -m uvicorn app.main:app --reload --port 8000
```

For officer email OTP, configure SMTP values. Production farmer registration and login require an SMS provider; Twilio can be configured with `SMS_PROVIDER=twilio`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER`. Without SMS configuration, production farmer OTP endpoints return a configuration error and do not claim delivery. For local registration testing only, an explicitly enabled development environment can verify registrations without SMS delivery. Set random `JWT_SECRET` and `OTP_SECRET`; MongoDB is required for persistence and is never replaced with memory storage.

For local development or automated testing only, `APP_ENV` must be `development` or `testing`, and `DEV_OTP_ENABLED=true` must be set to enable local verification without SMS. Keep this option disabled in production.

## BKIG agricultural assistant

The floating assistant calls `POST /api/v1/chatbot/message` and uses the Google GenAI Python SDK from the backend. Set `GEMINI_API_KEY`, `GEMINI_MODEL`, and optionally `GEMINI_FALLBACK_MODEL` in `backend/.env`; the primary defaults to `gemini-3.8-flash` and the fallback defaults to `gemini-3.7-flash`. Never use a `VITE_` variable for the key. `GEMINI_TIMEOUT_SECONDS` is the timeout per model attempt. On transient model unavailability, network failure, or timeout, BKIG tries the fallback once. If Gemini still cannot respond, the chatbot provides a clearly labeled local BKIG help answer instead of an error. Replies support English, Kannada, and Hindi; the widget can auto-detect the script or use the language selector. The assistant keeps conversation history in browser memory only and does not persist chat messages. It can include official daily AGMARKNET prices when `DATA_GOV_IN_API_KEY` is configured, the curated scheme directory, and claim status only for an authenticated farmer's own account. Database or market provider data that cannot be verified is reported as unavailable.

## Authentication API

- `POST /api/v1/auth/register` — farmer name/phone/password, sends a phone verification OTP.
- `POST /api/v1/auth/register/verify` — verifies OTP and returns a session.
- `POST /api/v1/auth/login` — validates a farmer phone/password or officer email/password and starts the corresponding OTP challenge.
- `POST /api/v1/auth/resend-otp` — resends an active login or registration challenge after the cooldown.
- `POST /api/v1/auth/login/verify-otp` — verifies the challenge and issues a short-lived JWT.
- `GET /api/v1/auth/me` — returns the authenticated profile.

Protected routes require `Authorization: Bearer <access_token>`. Farmers can read only their own claims and create claims; officers can access their review queue and record decisions.

## Other routes

- `GET/POST /api/v1/insurance/claims/` — farmer claim list/create.
- `GET /api/v1/insurance/claims/{claim_id}` — owned claim detail.
- `POST /api/v1/insurance/claims/{claim_id}/evidence` and `GET /api/v1/insurance/claims/{claim_id}/evidence/{evidence_id}` — owner upload and owner/officer retrieval of validated image evidence.
- `POST /api/v1/insurance/claims/{claim_id}/assessment` — authenticated assessment, limited to claim owner or officer.
- `GET /api/v1/officer/claims` — officer queue.
- `GET /api/v1/officer/claims/{claim_id}/assessments` — officer assessment history.
- `POST /api/v1/officer/claims/{claim_id}/review` — officer decision and audit history.
- `GET /api/v1/health/database` — MongoDB connectivity check.

Mandi price routes use the Ministry of Agriculture and Farmers Welfare daily market dataset through the Government of India Open Data API. Configure `DATA_GOV_IN_API_KEY` to enable it; the source is updated daily, not in real time. The scheme directory contains a limited set of official portal links and directs users to the current source for eligibility, documents, benefits, and application periods; it does not calculate eligibility or invent current rules. Frontend mock datasets are isolated and can only be enabled explicitly with `VITE_USE_MOCK=true`; those datasets are not live prices or verified eligibility decisions.
