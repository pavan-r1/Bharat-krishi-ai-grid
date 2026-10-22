# Bharat Krishi Intelligence Grid (BKIG) — Frontend

> **Agricultural Intelligence, Transparent Crop Insurance & Daily Market Insights for Indian Agriculture**

---

## 1. Project Overview

The **Bharat Krishi Intelligence Grid (BKIG)** is an AI-powered agricultural intelligence platform designed to empower Indian farmers and assist insurance claims officers.

The platform unites three core modules:
1. **Crop Insurance Fraud-Risk Detection:** Multi-step claim submission with geotagged evidence, automated NDVI vegetative anomaly checks, and an officer audit & review workflow.
2. **Mandi Price Intelligence:** Interactive commodity pricing trends across Indian APMCs (e.g. Karnataka, Maharashtra, Punjab), modal prices, arrival volumes, and comparative charts.
3. **Government Scheme Finder:** Searchable directory linking to official PMFBY, PM-KISAN, SMAM, and irrigation scheme portals. Current rules and checklists are confirmed on each official source.

---

## 2. Technology Stack

- **Framework:** React 18 with modern functional components & hooks
- **Build Tool:** Vite 5 with optimized vendor chunking
- **Routing:** React Router DOM v6 with role-aware route guards
- **Data Visualization:** Recharts for 7-day commodity trends and multi-mandi comparisons
- **Iconography:** Lucide React
- **HTTP Client:** Axios with centralized error normalization and interceptors
- **Styling:** Custom CSS design system with CSS custom properties (variables), botanical ivory/cream palette, and full responsive breakpoints

---

## 3. Visual Design System

The visual design system adheres strictly to the agricultural guidelines:
- **Forest Green (`#173F2A` / `#103B27`):** Primary brand color, headers, sidebar, primary buttons
- **Warm Cream & Soft Ivory (`#FFFDF7` / `#F7F1E3`):** Canvas background and elevated cards
- **Harvest Gold (`#D6A84F`):** Accents, badges, alerts, secondary highlights
- **Terracotta (`#A64B2A`):** Advisory elements, secondary accents
- **Sage Green (`#DDE4D0` / `#EEF3E6`):** Soft contextual backgrounds, positive state tags
- **Typography:** Serif headings (`Playfair Display`, `Cormorant Garamond`) paired with clear body sans-serif (`Inter`, `Poppins`)

---

## 4. Application Architecture & Routes

```text
frontend/
├── dist/                          # Production build output
├── public/
│   └── favicon.svg                # Botanical wheat emblem
├── src/
│   ├── assets/                    # Static imagery & iconography
│   ├── components/
│   │   ├── branding/
│   │   │   └── Logo.jsx           # SVG emblem & typography
│   │   ├── common/
│   │   │   ├── ClaimTimeline.jsx  # Audit history trail
│   │   │   ├── ConfirmModal.jsx   # Decision & action confirmation
│   │   │   ├── EmptyState.jsx     # Graceful empty state illustrations
│   │   │   ├── LoadingState.jsx   # Animated spinner state
│   │   │   ├── OTPInput.jsx       # 6-digit accessible OTP input
│   │   │   ├── RiskBadge.jsx      # Low / Medium / High risk pill
│   │   │   ├── StatCard.jsx       # Compact metric overview card
│   │   │   ├── StatusBadge.jsx    # Status pills (Submitted, Approved, etc.)
│   │   │   └── Stepper.jsx        # Multi-step progress indicator
│   │   └── layout/
│   │       ├── DashboardLayout.jsx# Responsive shell with sidebar + topbar
│   │       ├── Footer.jsx         # Public footer with institutional details
│   │       ├── Navbar.jsx         # Responsive landing navbar with mobile drawer
│   │       ├── Sidebar.jsx        # Dark-green collapsible navigation
│   │       └── Topbar.jsx         # Greeting, account menu & notifications
│   ├── context/
│   │   └── AuthContext.jsx        # Role-authoritative authentication & session
│   ├── data/
│   │   ├── mockClaims.js          # PMFBY insurance claims & telemetry
│   │   ├── mockDashboard.js       # Weather, telemetry & notification records
│   │   ├── mockMandiPrices.js     # APMC commodity prices & historical series
│   │   ├── mockSchemes.js         # Government welfare schemes & criteria
│   │   └── mockUsers.js           # Isolated profile fixtures; never used for authentication
│   ├── pages/
│   │   ├── public/
│   │   │   ├── AboutPage.jsx          # Mission, problem statement & architecture
│   │   │   ├── LandingPage.jsx        # Public hero, 3 feature pillars, impact
│   │   │   ├── LoginPage.jsx          # Split storytelling login & validation
│   │   │   ├── NotFoundPage.jsx       # 404 handler
│   │   │   ├── OTPVerificationPage.jsx# 6-digit OTP verification flow
│   │   │   └── RoleSelectionPage.jsx  # Dedicated Farmer vs Officer directory
│   │   ├── farmer/
│   │   │   ├── ClaimDetailsPage.jsx   # Full claim view, photos & telemetry
│   │   │   ├── FarmerDashboard.jsx    # Overview, recent claims, weather advisory
│   │   │   ├── FarmerProfilePage.jsx  # Landholding & Aadhaar details
│   │   │   ├── GovernmentSchemesPage.jsx# Scheme discovery & modal guides
│   │   │   ├── MandiPricesPage.jsx    # Commodity filters & Recharts trends
│   │   │   ├── MyClaimsPage.jsx       # Filterable claim list & status
│   │   │   └── SubmitClaimPage.jsx    # 4-step claim lodgement wizard
│   │   └── officer/
│   │       ├── ClaimReviewPage.jsx    # Tabbed audit, photo zoom & decision
│   │       ├── OfficerDashboard.jsx   # Priority queue & high-risk alert
│   │       ├── OfficerMandiPage.jsx   # Officer APMC market inspection
│   │       ├── OfficerProfilePage.jsx # Nodal assessor credentials
│   │       ├── OfficerSchemesPage.jsx # Welfare subsidy directory
│   │       └── ReviewQueuePage.jsx    # Sortable, searchable claims table
│   ├── routes/
│   │   └── ProtectedRoute.jsx     # Role-based route guard
│   ├── services/
│   │   ├── apiClient.js           # Axios instance with interceptors
│   │   ├── authService.js         # OTP & credentials handler
│   │   ├── claimsService.js       # Claim operations & local session store
│   │   ├── mandiService.js        # Market price service
│   │   └── schemesService.js      # Schemes service
│   ├── styles/
│   │   ├── components.css         # Reusable buttons, cards, forms, tables
│   │   ├── global.css             # Base reset, layout utilities & typography
│   │   └── variables.css          # Color tokens, fonts, spacing, shadows
│   ├── App.jsx                    # Central route definitions
│   └── main.jsx                   # Entry mount point
├── .env.example                   # Environment configuration template
├── index.html                     # HTML5 template with Google Fonts preconnect
├── package.json                   # Dependencies and scripts
└── vite.config.js                 # Vite configuration with chunk splitting
```

---

## 5. Route Table

| Path | Access Level | Description |
|---|---|---|
| `/` | Public | Homepage featuring hero section, 3 core pillars, how it works, and impact metrics |
| `/about` | Public | Architecture overview and agricultural mission statement |
| `/login` | Public | Farmer mobile or officer email sign-in with password and OTP verification |
| `/verify-otp` | Public | 6-digit OTP entry with countdown timer and paste support |
| `/role-selection` | Public | Role selection directory comparing Farmer vs Insurance Officer privileges |
| `/farmer/dashboard` | Farmer | Summary cards, recent claim filings, agro-weather advisory, mandi snapshot |
| `/farmer/submit-claim`| Farmer | 4-step wizard (Crop, Land/Survey, Evidence photos, Review & Submit) |
| `/farmer/claims` | Farmer | Searchable and filterable table of submitted insurance claims |
| `/farmer/claims/:id` | Farmer | Detailed claim inspection with photo gallery modal and telemetry timeline |
| `/farmer/mandi-prices`| Farmer | Daily government mandi prices with filters, trends when source history is available, and APMC comparisons |
| `/farmer/schemes` | Farmer | Searchable official scheme directory with current-source links and guidance |
| `/farmer/profile` | Farmer | Farmer landholding, Aadhaar e-KYC status, and Kisan Call Center support |
| `/officer/dashboard` | Officer | Zonal overview, high-risk alert banners, and priority review queue |
| `/officer/queue` | Officer | Centralized audit table with risk scores, crop/status filters, and sorting |
| `/officer/claims/:id`| Officer | Tabbed audit dossier: Claim Info, Photo Evidence, AI Telemetry, Review & Decision (Approve/Reject/Request Info), and Audit Timeline |
| `/officer/mandi-prices`| Officer | Regional APMC price monitor for loss valuation |
| `/officer/schemes` | Officer | Agricultural welfare subsidy directory |
| `/officer/profile` | Officer | Nodal assessor credentials, clearance ceiling, and branch metadata |
| `*` | Public | Accessible 404 Not Found route |

---

## 6. Authentication

Farmers sign in with their verified mobile number and password, then verify an OTP. Officers continue to sign in with their verified email and password, then verify an OTP. Role and authorization come from the matched backend account. Existing email-based farmer accounts can use the account-upgrade link on the registration page to verify a phone number before using phone sign-in.

Mock datasets are kept separate for local UI tests and previews. They never authenticate a user or grant access to backend routes. Configure `VITE_USE_MOCK=true` only when intentionally viewing those fixtures.

---

## 7. Installation & Local Development

### Prerequisites
- Node.js `v18.0.0` or later (tested on Node `v22.14.0`)
- npm `v9.0.0` or later (tested on npm `10.9.2`)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to create `.env` (optional; defaults to mock mode):
```bash
cp .env.example .env
```
Inside `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=true
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates an optimized, minified production bundle in `dist/`.

---

## 8. Backend Developer Integration Contract

When integrating with the FastAPI backend (`backend/app`), the services are organized in `src/services/` and expect the following endpoints:

### Claims API
- `GET /api/v1/insurance/claims/`
  - Returns: `{ count: number, claims: Claim[] }`
- `POST /api/v1/insurance/claims/`
  - Request Body:
    ```json
    {
      "farmer_name": "Rameshwar Patel",
      "farmer_id": "BKIG-FARMER-001",
      "crop": "Ragi",
      "district": "Bengaluru Rural",
      "claimed_amount": 45000
    }
    ```
  - Returns: HTTP `201 Created` with created claim document including `claim_id`.

### Officer Review API
- `GET /api/v1/officer/claims`
  - Returns claims list for officer assessment.
- `GET /api/v1/officer/claims/{claim_id}/assessments`
  - Returns model prediction records for `{claim_id}`.
- `POST /api/v1/officer/claims/{claim_id}/review`
  - Request Body:
    ```json
    {
      "decision": "approved", // "approved" | "rejected" | "needs_more_information" | "pending"
      "notes": "Satellite vegetation telemetry correlates with stated drought damage."
    }
    ```
  - Returns: `{ review_id: string, claim_id: string, decision: string, message: string }`

### Fraud Assessment API
- `POST /api/v1/insurance/claims/{claim_id}/assessment`
  - Request Body:
    ```json
    {
      "area_hectares": 2.5,
      "rainfall_mm": 80.0,
      "previous_claims": 1,
      "weather_match": 1
    }
    ```

To switch from mock mode to the real backend, set `VITE_USE_MOCK=false` in `.env` and start your FastAPI server on port 8000.
