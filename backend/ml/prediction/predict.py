import os
import math
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "gradient_boosting.joblib")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "scaler.joblib")

_model = None
_scaler = None

def load_ml_pipeline():
    global _model, _scaler
    if _model is not None:
        return _model, _scaler

    if os.path.exists(MODEL_PATH):
        try:
            _model = joblib.load(MODEL_PATH)
            print(f"[ML Engine] Loaded Gradient Boosting Regressor model from {MODEL_PATH}")
        except Exception as e:
            print(f"[ML Engine] Failed to load model: {e}")

    if os.path.exists(SCALER_PATH):
        try:
            _scaler = joblib.load(SCALER_PATH)
            print(f"[ML Engine] Loaded Scaler from {SCALER_PATH}")
        except Exception as e:
            print(f"[ML Engine] Failed to load scaler: {e}")

    return _model, _scaler

def predict_reliability_score(
    forecast_temp: float,
    obs_temp: float,
    forecast_sal: float,
    obs_sal: float,
    forecast_spd: float,
    obs_spd: float
) -> dict:
    model, scaler = load_ml_pipeline()

    temp_bias = abs(forecast_temp - obs_temp)
    sal_bias = abs(forecast_sal - obs_sal)
    current_bias = abs(forecast_spd - obs_spd)

    raw_score = None
    if model is not None:
        input_df = pd.DataFrame([{
            "temp_bias": temp_bias,
            "sal_bias": sal_bias,
            "current_bias": current_bias,
            "temp_hycom": forecast_temp,
            "temp_obs": obs_temp,
            "sal_hycom": forecast_sal,
            "sal_obs": obs_sal,
            "speed_hycom": forecast_spd,
            "speed_obs": obs_spd
        }])

        try:
            if scaler is not None:
                input_scaled = scaler.transform(input_df)
                raw_score = float(model.predict(input_scaled)[0])
            else:
                raw_score = float(model.predict(input_df)[0])
        except Exception:
            raw_score = None

    if raw_score is None or math.isnan(raw_score):
        raw_score = 100.0 - (temp_bias * 5.0 + sal_bias * 3.0 + current_bias * 15.0)

    # Smooth asymptotic score floor (prevents unhelpful 0% for large input biases)
    if raw_score <= 15.0:
        decay = math.exp(-(temp_bias * 0.12 + sal_bias * 0.05 + current_bias * 0.25))
        score = max(15.0, round(50.0 * decay, 1))
    else:
        score = round(min(99.4, raw_score), 1)

    if score >= 80.0:
        cat = "High Reliability"
        conf = "High Confidence"
        risk = "Low Risk"
    elif score >= 60.0:
        cat = "Moderate Reliability"
        conf = "Medium Confidence"
        risk = "Moderate Risk"
    else:
        cat = "Low Reliability"
        conf = "Low Confidence"
        risk = "High Risk"

    return {
        "reliability_score": score,
        "predicted_category": cat,
        "confidence_level": conf,
        "risk_level": risk,
        "temp_bias": round(temp_bias, 3),
        "sal_bias": round(sal_bias, 3),
        "current_bias": round(current_bias, 3),
        "model_used": "Gradient Boosting Regressor"
    }
