"""Experimental fraud risk inference; the bundled artifact was trained on synthetic data."""
from pathlib import Path

try:
    import joblib
    import pandas as pd
    MODEL_PATH = Path(__file__).resolve().parents[2] / "ml" / "fraud_model.joblib"
    _bundle = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None
    _model = _bundle.get("model") if _bundle else None
    FEATURES = _bundle.get("features", []) if _bundle else []
except Exception:
    _bundle, _model, FEATURES = None, None, []


def assess_claim(claimed_amount, area_hectares, rainfall_mm, previous_claims, weather_match):
    if _model is None or not FEATURES:
        raise RuntimeError("Model artifact or dependencies unavailable")
    values = {"claimed_amount": claimed_amount, "area_hectares": area_hectares,
              "rainfall_mm": rainfall_mm, "previous_claims": previous_claims,
              "weather_match": weather_match}
    probability = float(_model.predict_proba(pd.DataFrame([values], columns=FEATURES))[0][1])
    category = "high" if probability >= .70 else "medium" if probability >= .40 else "low"
    return {"risk_score": round(probability * 100, 2), "risk_category": category,
            "model_version": _bundle.get("model_version", "unknown"),
            "data_type": _bundle.get("data_type", "unverified"),
            "disclaimer": "Experimental score from a model trained on synthetic data. Not evidence of fraud and not suitable for claim rejection."}
