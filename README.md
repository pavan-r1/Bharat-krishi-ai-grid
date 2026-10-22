# Bharat Krishi Intelligence Grid (BKIG)
An AI-enabled agricultural decision-support platform designed to bring
crop-insurance claim assessment, mandi-price information,
government-scheme guidance, and conversational agricultural assistance
into one application.

> **Project status:** Feature availability depends on the current code,
> configuration, and connected data providers. The fraud-detection model
> has previously been described as experimental and trained on synthetic
> demonstration data. Its output is not proof of fraud or an official
> claim decision. Mandi prices require a working, authorized provider
> and valid credentials.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Machine-Learning Model](#machine-learning-model)
- [Gemini AI Chatbot](#gemini-ai-chatbot)
- [Mandi Price Integration](#mandi-price-integration)
- [Multilingual Support](#multilingual-support)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations-and-responsible-use)

## Overview
BKIG aims to help farmers and agricultural officers access useful
agricultural information through one platform. It combines structured
application workflows with machine-learning-based risk assessment and a
conversational AI assistant.

## Key Features

### 1. Crop-insurance claim and risk assessment

- Collects claim information and supporting evidence through the
  application.
- Uses a Random Forest classifier for experimental risk assessment,
  subject to the model and preprocessing configured in the backend.
- Supports an officer-review workflow where implemented and
  authorized.
- Model-generated risk indicators are decision-support signals only;
  they do not establish that a claim is fraudulent.

### 2. Mandi price intelligence
Designed to show agricultural commodity prices by market, including
state, district, market, commodity, minimum price, maximum price, modal
price, and arrival date when supplied by the provider.

Current prices are available only when a valid provider endpoint,
credentials, network access, and compatible response mapping are
configured. The application must not substitute invented prices when the
provider is unavailable.

### 3. Government agricultural scheme guidance
Helps users explore agricultural schemes and eligibility guidance.
Verify eligibility, current rules, deadlines, and application
requirements on the relevant official government portal.

### 4. Gemini-powered agricultural chatbot
The backend can integrate with the Google Gemini API to answer
agricultural questions and explain how to use BKIG. The exact model is
determined by backend configuration. The API key must remain on the
backend and must never be included in frontend code.

### 5. Multilingual interface
The intended localization scope includes English, Kannada, and Hindi.
Confirm which translations are implemented in the current branch. The
chatbot can be instructed to respond in the selected language, subject
to the configured Gemini integration.

### 6. Role-based access
The application is intended to distinguish farmer and officer
capabilities. Private data and privileged actions must be checked by the
backend, not merely hidden in the frontend.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React |
| Backend API | Python, FastAPI |
| Database | MongoDB |
| Fraud-risk model | Scikit-learn Random Forest classifier |
| Conversational AI | Google Gemini API, when configured |
| Authentication | Password hashing, OTP verification, and JWT-based sessions as implemented |
| Market data | data.gov.in or another authorized provider, when configured |
| Hosting | Depends on the selected frontend and backend hosting providers |

This table describes the reported/intended stack. Check the current
repository and environment files for exact dependencies and enabled
integrations.

## Architecture

```text
Farmer / Officer
       |
       v
React Frontend
       |
       v
FastAPI Backend
   |       |         |
   v       v         v
MongoDB  ML Model  Gemini API
   |
   v
Claims, users, reviews, and application data

FastAPI Backend ---> Authorized Mandi Data Provider
```

The actual deployed data flow depends on which services are configured
and available.

## Prerequisites

- Git
- Python version supported by the backend dependencies
- Node.js and npm compatible with the frontend
- Reachable MongoDB deployment (local MongoDB or MongoDB Atlas)
- Gemini API key if using the AI chatbot
- data.gov.in API key or other authorized provider credentials if
  using live mandi data

## Local Setup

### 1. Clone the repository

```text
git clone https://github.com/pavan-r1/Bharat-krishi-ai-grid.git
cd Bharat-krishi-ai-grid
```

### 2. Configure the backend

If `backend/.env.example` exists and `backend/.env` does not, copy it.

**Windows PowerShell:**

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend/.env` with the values required by the code. Do not
overwrite an existing environment file.

Create and activate a virtual environment if you do not already have
one:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

If the project already uses another virtual-environment location, keep
using that environment instead of creating a duplicate.

### 3. Configure the frontend

If `frontend/.env.example` exists and `frontend/.env.local` does not,
copy it:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

Inspect the example file and configure the backend API base URL expected
by the frontend. Never place server-side secrets in frontend environment
variables.

Install frontend dependencies:

```powershell
cd frontend
npm install
```

Use `npm ci` instead when a compatible `package-lock.json` is committed
and a reproducible install is desired.

## Environment Configuration

Use the exact variable names expected by the current code. Common
configuration entries may include:

```dotenv
MONGODB_URI=
DATABASE_NAME=

# Gemini chatbot (if enabled)
GEMINI_API_KEY=
GEMINI_MODEL=

# Mandi data provider (if enabled)
DATA_GOV_IN_API_KEY=

# Authentication secrets: use strong, unique random values
JWT_SECRET=
OTP_SECRET=
```

These are examples, not a guarantee that every variable is used by the
current branch. Check the backend configuration and `.env.example`
files. Never commit `.env` or `.env.local`, and never include real
credentials in source control, logs, screenshots, or this README.

## Running the Application

Start the backend from the backend directory:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

In a separate terminal, start the frontend:

```powershell
cd frontend
npm run dev
```

Open the local URL printed by the frontend development server. The
frontend API base URL must point to the running backend.

For deployment, configure environment variables and network access
through the hosting provider. Do not use development-only settings in
production.

## Machine-Learning Model

The fraud-risk component has been described as using a **Random Forest
Classifier** from Scikit-learn.

A typical flow is:

1. Receive structured claim details.
2. Validate and preprocess features using the same schema and
   transformations used during training.
3. Load the persisted model artifact.
4. Generate a prediction or risk score supported by the model
   implementation.
5. Present the result to an authorized reviewer.

**Model limitations:** Earlier development notes described a model
trained on synthetic demonstration data, not demonstrated real-world
accuracy. Before operational use, evaluate on representative, properly
labelled data; measure precision, recall, false-positive rates,
calibration, and performance across relevant groups; and document the
model version and training data. A model score must not be treated as
proof of fraud or used as the sole basis for denying a claim.

## Gemini AI Chatbot

The chatbot uses the backend to call the Google Gemini API.

- Configure `GEMINI_API_KEY` and a supported `GEMINI_MODEL` according
  to the backend code.
- Keep the key on the server; never expose it to the browser.
- Handle provider errors, rate limits, quota exhaustion, and timeouts
  gracefully.
- Do not send passwords, OTPs, JWTs, or unnecessary personal
  information to Gemini.
- Do not claim a response is verified government guidance unless
  checked against an authoritative source.
- For live mandi prices, scheme details, or private claim status, use
  authorized backend data rather than asking the model to invent
  information.

## Mandi Price Integration

To enable live market data:

1. Find the relevant daily mandi-price resource on the official [Open
   Government Data platform](https://www.data.gov.in/).
2. Review the resource's current API documentation, fields, limits, and
   terms.
3. Obtain an API key if the resource requires one.
4. Configure the key in the backend environment.
5. Test the endpoint and verify that response fields are mapped
   correctly.
6. Show the provider and source/arrival date in the UI.

The provider may return daily wholesale market data rather than
real-time prices. If credentials are absent, the provider is
unavailable, or no records match a query, show an honest status message
and do not fabricate prices.

## Multilingual Support

The intended language options are English, Kannada, and Hindi.

- Keep translations in organized localization files.
- Use a shared language selector and localization state.
- Persist the selected language appropriately.
- Translate labels, forms, errors, navigation, dashboards, and chatbot
  controls.
- Preserve identifiers and data fields used by APIs.
- Verify regional scripts render correctly and longer translations do
  not break responsive layouts.

Check the current implementation before claiming every screen is fully
translated.

## Security Notes

- Never commit API keys, database credentials, OTP secrets, or JWT
  secrets.
- Use secure password hashing and short-lived authentication tokens as
  appropriate.
- Enforce role-based permissions in backend endpoints.
- Validate uploads, input sizes, and request payloads.
- Apply rate limits to authentication, OTP, and chatbot endpoints.
- Do not expose private farmer information to other users.
- Restrict development-only OTP behavior to an explicitly enabled
  local test environment; never accept a fixed test OTP in production.
- Use HTTPS and production-grade secret management when deployed.
- Do not use real farmer data without appropriate authorization and
  privacy safeguards.

## Troubleshooting

### Registration returns HTTP 503

Check backend logs and database connectivity. Registration requires the
configured database to be reachable. Do not suppress the error or
create a fake successful response.

### Login returns HTTP 401

Verify the account exists, the submitted identifier and password are
correct, and the current authentication flow expects those credentials.
Do not disable authentication to work around the error.

### Chatbot returns HTTP 502 or 504

Check backend logs, Gemini API key, configured model, quota, network
connectivity, and timeout settings. Temporary provider errors may
require bounded retries, but retries cannot guarantee recovery while the
provider is unavailable.

### Mandi prices are unavailable

Check the API key, current resource endpoint, provider availability,
query filters, and backend environment loading. Verify the resource
documentation rather than assuming an older endpoint is still
supported.

### Scikit-learn version warning

If a persisted model was saved using a different Scikit-learn version,
use a controlled, compatible environment and preferably retrain and
re-save the model under intended dependency versions. Do not ignore
compatibility warnings for production inference.

## Limitations and Responsible Use

- External-service availability depends on credentials, connectivity,
  provider quotas, and terms.
- Mandi prices may be delayed and should be displayed with their source
  date.
- Scheme guidance should link to official sources and not guarantee
  eligibility.
- The fraud-risk model is decision support and requires validation on
  real, representative data before consequential use.
- AI-generated answers can be inaccurate. Verify important
  agricultural, insurance, financial, and government decisions with
  appropriate official sources or qualified personnel.

## Maintainer

**Project:** Bharat Krishi Intelligence Grid (BKIG)

**Repository:** [pavan-r1/Bharat-krishi-ai-grid](https://github.com/pavan-r1/Bharat-krishi-ai-grid)