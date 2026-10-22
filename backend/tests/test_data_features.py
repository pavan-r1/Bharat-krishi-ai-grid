import os
import unittest
from unittest.mock import patch

from app.api.schemes import get_categories, get_scheme, get_schemes
from app.main import app
from app.services.fraud_service import assess_claim
from app.services.market_data import get_prices, parse_date, query_records, value


class PublicDataFeatureTests(unittest.TestCase):
    def test_api_registers_real_feature_routes_without_demo_auth_routes(self):
        paths = set(app.openapi()["paths"])
        self.assertIn("/api/v1/mandi/prices", paths)
        self.assertIn("/api/v1/schemes/", paths)
        self.assertIn("/api/v1/auth/login/verify-otp", paths)
        self.assertFalse(any("demo" in path.casefold() for path in paths))

    def test_scheme_search_filters_and_returns_official_details(self):
        matches = get_schemes(search="PM-KISAN")
        self.assertEqual([item["id"] for item in matches], ["PMKISAN"])
        self.assertIn("Financial Assistance", get_categories())
        detail = get_scheme("PMKISAN")
        self.assertTrue(detail["officialUrl"].startswith("https://pmkisan.gov.in/"))
        self.assertIn("official", " ".join(detail["documents"]).lower())

    def test_market_data_uses_dated_snapshot_without_live_provider_configuration(self):
        with patch.dict(os.environ, {}, clear=True):
            rows, source, is_live = query_records()
            response = get_prices(commodity="Ragi (Finger Millet)")
        self.assertEqual(len(rows), 92)
        self.assertEqual(source, "Dated CSV market snapshot")
        self.assertFalse(is_live)
        self.assertFalse(response["isLiveData"])
        self.assertEqual(response["dataStatus"], "snapshot")
        self.assertTrue(response["marketComparisons"])
        self.assertEqual(response["lastUpdated"], "2026-10-22")

    def test_snapshot_filters_and_excel_encoded_price_columns(self):
        rows, _, _ = query_records({"Commodity": "Ragi (Finger Millet)"})
        self.assertTrue(rows)
        self.assertIsNotNone(value(rows[0], "modal_price"))
        self.assertIsNotNone(value(rows[0], "min_price"))
        self.assertIsNotNone(value(rows[0], "max_price"))

    def test_karnataka_snapshot_records_keep_source_provenance(self):
        rows, _, is_live = query_records({"State": "Karnataka", "Commodity": "Tomato"})
        self.assertFalse(is_live)
        self.assertEqual(len(rows), 6)
        self.assertTrue(all(value(row, "record_source_url") for row in rows))
        self.assertTrue(all(value(row, "arrival_date") == "19/10/2026" for row in rows))

    def test_market_record_field_and_date_normalization(self):
        row = {"Arrival_Date": "21/10/2026", "Modal_x0020_Price": "4,250"}
        self.assertEqual(value(row, "modal_price"), "4,250")
        self.assertEqual(parse_date(value(row, "arrival_date")).isoformat(), "2026-10-21")

    def test_bundled_model_returns_disclosed_experimental_score(self):
        result = assess_claim(claimed_amount=40000, area_hectares=2, rainfall_mm=50, previous_claims=0, weather_match=0)
        self.assertGreaterEqual(result["risk_score"], 0)
        self.assertLessEqual(result["risk_score"], 100)
        self.assertIn("synthetic data", result["disclaimer"])


if __name__ == "__main__":
    unittest.main()
