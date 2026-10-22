"""Explicitly labelled fixtures for disconnected market/scheme data providers."""
import os
from fastapi import APIRouter, Depends, HTTPException, Query

router = APIRouter(tags=["Market and Scheme Directory"])


def require_demo_mode():
    if os.getenv("DEMO_MODE", "false").lower() != "true":
        raise HTTPException(status_code=503, detail="No live data provider is configured; demo fixtures are disabled.")

_schemes = [
    {"id": "PMFBY", "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "ministry": "Ministry of Agriculture and Farmers Welfare, Government of India", "category": "Insurance", "state": "All India / National", "summary": "Crop insurance programme. Confirm current notified crops, area, terms, and enrollment dates with the official portal.", "subsidyDetails": "Current premium and subsidy details vary by notification; verify on the official portal.", "eligibility": ["Eligibility depends on the current state, season, crop, and notification. Verify with the official scheme portal."], "benefits": ["Refer to the current official scheme notification."], "documents": ["Document requirements are defined by the current official notification."], "steps": ["Check current rules and enrollment availability on the official portal."], "officialUrl": "https://pmfby.gov.in", "isPopular": True, "demo_record": True, "verified_at": None},
    {"id": "PMKISAN", "title": "PM-KISAN", "ministry": "Ministry of Agriculture and Farmers Welfare, Government of India", "category": "Financial Assistance", "state": "All India / National", "summary": "Direct income support scheme. Verify current eligibility and account status with the official portal.", "subsidyDetails": "Current benefit and eligibility details must be verified on the official portal.", "eligibility": ["Refer to current official eligibility rules; this directory does not determine eligibility."], "benefits": ["Refer to the current official scheme guidance."], "documents": ["Check the current official checklist."], "steps": ["Use the official portal to verify eligibility and application status."], "officialUrl": "https://pmkisan.gov.in", "isPopular": True, "demo_record": True, "verified_at": None},
    {"id": "SMAM", "title": "Sub-Mission on Agricultural Mechanization (SMAM)", "ministry": "Department of Agriculture and Farmers Welfare, Government of India", "category": "Equipment", "state": "All India / National", "summary": "Agricultural mechanization programme. Current state availability, equipment, and assistance must be confirmed with official authorities.", "subsidyDetails": "No amount shown because current rates depend on applicable guidance and state implementation.", "eligibility": ["Check current official guidelines and state-level availability."], "benefits": ["Refer to the current official scheme guidance."], "documents": ["Check the current official checklist."], "steps": ["Consult the official agriculture mechanization portal or state department."], "officialUrl": "https://agrimachinery.nic.in", "isPopular": False, "demo_record": True, "verified_at": None},
    {"id": "PMKSY", "title": "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)", "ministry": "Government of India", "category": "Irrigation & Soil", "state": "All India / National", "summary": "Irrigation programme directory entry. Check current component and state implementation details with the official authorities.", "subsidyDetails": "Current support depends on component and applicable state guidance; verify officially.", "eligibility": ["Eligibility varies by component and state. Verify current official rules."], "benefits": ["Refer to current official programme guidance."], "documents": ["Check the current official checklist."], "steps": ["Consult the official programme portal and state department."], "officialUrl": "https://pmksy.gov.in", "isPopular": False, "demo_record": True, "verified_at": None},
]
_categories = ["All Categories", "Insurance", "Financial Assistance", "Equipment", "Irrigation & Soil"]
_crops = ["Ragi (Finger Millet)", "Wheat", "Paddy (Dhan)", "Maize (Corn)"]
_ragi = {
    "commodity": "Ragi (Finger Millet)", "variety": "Demo sample", "unit": "₹ / Quintal (100 kg)",
    "lastUpdated": "Demo fixture — not a live observation", "source": "BKIG sample fixture; no live market provider configured",
    "summary": {"modalPrice": 3850, "minPrice": 3500, "maxPrice": 4200, "change7d": "sample", "trend": "up"},
    "historicalTrend": [{"date": f"Sample day {i}", "modal": 3680 + i * 28, "min": 3400 + i * 15, "max": 3950 + i * 35} for i in range(7)],
    "marketComparisons": [
        {"market": "Demo APMC North", "state": "Karnataka", "district": "Bengaluru Rural", "arrivalsTonnes": 18, "minPrice": 3500, "maxPrice": 4200, "modalPrice": 3850},
        {"market": "Demo APMC South", "state": "Karnataka", "district": "Mysuru", "arrivalsTonnes": 14, "minPrice": 3450, "maxPrice": 4100, "modalPrice": 3780},
    ], "isSampleData": True,
}


@router.get("/api/v1/mandi/crops", dependencies=[Depends(require_demo_mode)])
def mandi_crops():
    return _crops


@router.get("/api/v1/mandi/states", dependencies=[Depends(require_demo_mode)])
def mandi_states():
    return [{"name": "Karnataka", "districts": [{"name": "Bengaluru Rural", "markets": ["Demo APMC North"]}, {"name": "Mysuru", "markets": ["Demo APMC South"]}]}]


@router.get("/api/v1/mandi/prices", dependencies=[Depends(require_demo_mode)])
def mandi_prices(commodity: str = Query("Ragi (Finger Millet)", min_length=1, max_length=100), state: str | None = None, district: str | None = None, market: str | None = None, date: str | None = None, search: str | None = Query(None, max_length=100)):
    if commodity.casefold() != _ragi["commodity"].casefold():
        return {**_ragi, "commodity": commodity, "summary": {"modalPrice": None, "minPrice": None, "maxPrice": None, "change7d": None, "trend": "unavailable"}, "historicalTrend": [], "marketComparisons": []}
    data = {**_ragi, "marketComparisons": list(_ragi["marketComparisons"])}
    if state and state.lower() != "all":
        data["marketComparisons"] = [m for m in data["marketComparisons"] if m["state"].casefold() == state.casefold()]
    if district:
        data["marketComparisons"] = [m for m in data["marketComparisons"] if m["district"].casefold() == district.casefold()]
    if market:
        data["marketComparisons"] = [m for m in data["marketComparisons"] if market.casefold() in m["market"].casefold()]
    if search:
        data["marketComparisons"] = [m for m in data["marketComparisons"] if search.casefold() in f"{m['market']} {m['district']} {m['state']}".casefold()]
    if date:
        data["historicalTrend"] = [row for row in data["historicalTrend"] if row["date"] == date]
    return data


@router.get("/api/v1/schemes/categories", dependencies=[Depends(require_demo_mode)])
def scheme_categories():
    return _categories


@router.get("/api/v1/schemes/", dependencies=[Depends(require_demo_mode)])
def schemes(category: str | None = None, search: str | None = Query(None, max_length=120)):
    results = _schemes
    if category and category.casefold() != "all categories":
        results = [s for s in results if s["category"].casefold() == category.casefold()]
    if search:
        term = search.casefold()
        results = [s for s in results if term in " ".join([s["title"], s["summary"], s["category"], s["ministry"]]).casefold()]
    return results


@router.get("/api/v1/schemes/{scheme_id}", dependencies=[Depends(require_demo_mode)])
def scheme_detail(scheme_id: str):
    scheme = next((s for s in _schemes if s["id"].casefold() == scheme_id.casefold()), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
