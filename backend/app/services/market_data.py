"""AGMARKNET market prices, with a bundled dated CSV snapshot as fallback."""
import csv
import json
import os
import re
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api/v1/mandi", tags=["Mandi price intelligence"])
RESOURCE_ID = os.getenv("DATA_GOV_MANDI_RESOURCE_ID", "9ef84268-d588-465a-a308-a864a43d0070")
SOURCE_URL = "https://data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
SNAPSHOT_PATH = Path(os.getenv("DATA_GOV_MANDI_CSV", Path(__file__).resolve().parents[2] / "data" / "mandi_prices.csv"))


def _live_records(filters=None, limit=1000, offset=0):
    api_key = os.getenv("DATA_GOV_IN_API_KEY")
    if not api_key:
        return None
    params = {"api-key": api_key, "format": "json", "limit": min(max(limit, 1), 1000), "offset": max(offset, 0), "sort[Arrival_Date]": "desc"}
    for field, value in (filters or {}).items():
        if value:
            params[f"filters[{field}]"] = value
    url = f"https://api.data.gov.in/resource/{RESOURCE_ID}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "BKIG/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
        result = payload.get("records")
        return result if isinstance(result, list) else None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError):
        return None


def _normalized_key(key):
    # Excel encodes spaces in CSV headers as e.g. Min_x0020_Price.
    return re.sub(r"[^a-z0-9]", "", re.sub(r"_x[0-9a-f]{4}_", " ", str(key).lower()))


def value(row, *names):
    lowered = {_normalized_key(key): val for key, val in row.items()}
    for name in names:
        candidate = lowered.get(_normalized_key(name))
        if candidate is not None:
            return candidate
    return None


def _matches(row, filters):
    for field, expected in (filters or {}).items():
        actual = value(row, field)
        if expected:
            if actual is None:
                return False
            # Commodity labels commonly vary only in punctuation/spacing across UI and feed.
            normalize = lambda item: re.sub(r"[^a-z0-9]", "", str(item).casefold())
            if normalize(actual) != normalize(expected):
                return False
    return True


def _snapshot_records(filters=None, limit=1000, offset=0):
    if not SNAPSHOT_PATH.is_file():
        return []
    try:
        with SNAPSHOT_PATH.open("r", encoding="utf-8-sig", newline="") as source:
            rows = [row for row in csv.DictReader(source) if _matches(row, filters)]
        rows.sort(key=lambda row: parse_date(value(row, "arrival_date")) or datetime.min.date(), reverse=True)
        return rows[max(offset, 0):max(offset, 0) + min(max(limit, 1), 1000)]
    except (OSError, csv.Error, UnicodeError):
        return []


def query_records(filters=None, limit=1000, offset=0):
    """Return rows and provenance; live data is preferred, snapshot is an honest fallback."""
    live_rows = _live_records(filters, limit, offset)
    if live_rows is not None:
        return live_rows, "Government of India AGMARKNET daily feed", True
    snapshot_rows = _snapshot_records(filters, limit, offset)
    if snapshot_rows:
        return snapshot_rows, "Dated CSV market snapshot", False
    raise HTTPException(status_code=503, detail="Mandi price records are temporarily unavailable.")


def records(filters=None, limit=1000, offset=0):
    return query_records(filters, limit, offset)[0]


def price_number(row, *names):
    try:
        return float(str(value(row, *names)).replace(",", ""))
    except (TypeError, ValueError):
        return None


def parse_date(raw):
    if not raw:
        return None
    for pattern in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%d-%b-%Y"):
        try:
            return datetime.strptime(str(raw).strip(), pattern).date()
        except ValueError:
            continue
    return None


@router.get("/crops")
def get_crops():
    rows, _, _ = query_records(limit=1000)
    return sorted({str(value(row, "commodity")) for row in rows if value(row, "commodity")})


@router.get("/states")
def get_states():
    rows, _, _ = query_records(limit=1000)
    states = sorted({str(value(row, "state")) for row in rows if value(row, "state")})
    return [{"name": state, "districts": []} for state in states]


@router.get("/prices")
def get_prices(
    commodity: str = Query(min_length=1, max_length=100),
    state: str | None = None,
    district: str | None = None,
    market: str | None = None,
    search: str | None = None,
):
    filters = {"Commodity": commodity, "State": state, "District": district, "Market": market}
    rows, source, is_live = query_records(filters=filters, limit=1000)
    if search:
        term = search.casefold()
        rows = [row for row in rows if term in str(value(row, "market") or "").casefold() or term in str(value(row, "district") or "").casefold()]
    comparisons = []
    daily = {}
    for row in rows:
        modal = price_number(row, "modal_price", "modal price")
        low = price_number(row, "min_price", "min price")
        high = price_number(row, "max_price", "max price")
        if modal is None:
            continue
        date = parse_date(value(row, "arrival_date", "arrival date"))
        comparisons.append({
            "market": value(row, "market") or "", "district": value(row, "district") or "",
            "state": value(row, "state") or "", "variety": value(row, "variety") or "",
            "arrivalsTonnes": None, "minPrice": low, "maxPrice": high, "modalPrice": modal,
            "arrivalDate": date.isoformat() if date else value(row, "arrival_date"),
            "recordSource": value(row, "record_source"),
            "recordSourceUrl": value(row, "record_source_url"),
        })
        if date:
            daily.setdefault(date, []).append((modal, low, high))
    comparisons.sort(key=lambda item: (item["arrivalDate"] or "", item["market"]), reverse=True)
    trend = []
    for date in sorted(daily):
        entries = daily[date]
        values = lambda index: [entry[index] for entry in entries if entry[index] is not None]
        trend.append({"date": date.strftime("%d %b"), "modal": round(sum(values(0)) / len(values(0))),
                      "min": round(sum(values(1)) / len(values(1))) if values(1) else None,
                      "max": round(sum(values(2)) / len(values(2))) if values(2) else None})
    latest_date = max(daily) if daily else None
    latest = daily.get(latest_date, []) if latest_date else []
    recent_modals = [entry[0] for entry in latest]
    seven_days_ago = [entry[0] for date, entries in daily.items() if latest_date and 6 <= (latest_date - date).days <= 8 for entry in entries]
    latest_average = sum(recent_modals) / len(recent_modals) if recent_modals else None
    previous_average = sum(seven_days_ago) / len(seven_days_ago) if seven_days_ago else None
    change = f"{((latest_average - previous_average) / previous_average * 100):+.1f}%" if latest_average is not None and previous_average else "Not available"
    trend_label = "up" if latest_average is not None and previous_average and latest_average >= previous_average else "down"
    date_label = latest_date.isoformat() if latest_date else "No observations available"
    return {
        "commodity": commodity,
        "variety": "Multiple varieties" if len({item["variety"] for item in comparisons if item["variety"]}) > 1 else (comparisons[0]["variety"] if comparisons else ""),
        "unit": "₹ / Quintal (100 kg)", "lastUpdated": date_label,
        "source": source, "sourceUrl": SOURCE_URL,
        "summary": {"modalPrice": round(latest_average) if latest_average is not None else None,
                    "minPrice": round(min((entry[1] for entry in latest if entry[1] is not None), default=0)) or None,
                    "maxPrice": round(max((entry[2] for entry in latest if entry[2] is not None), default=0)) or None,
                    "change7d": change, "trend": trend_label},
        "marketComparisons": comparisons, "historicalTrend": trend[-7:],
        "isLiveData": is_live, "dataStatus": "live" if is_live else "snapshot",
    }
