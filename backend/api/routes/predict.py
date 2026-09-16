import json
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine, get_engine_type
from backend.ml.prediction.predict import predict_reliability_score

router = APIRouter(prefix="/predict", tags=["ML Model Inference"])

class PredictRequest(BaseModel):
    region_id: Optional[str] = "IND_WEST"
    latitude: float = Field(..., example=15.5)
    longitude: float = Field(..., example=72.5)
    depth: float = Field(0.0, example=0.0)
    forecast_temperature: float = Field(..., example=28.5)
    observed_temperature: float = Field(..., example=28.2)
    forecast_salinity: float = Field(..., example=35.1)
    observed_salinity: float = Field(..., example=35.0)
    forecast_current_speed: float = Field(..., example=0.20)
    observed_current_speed: float = Field(..., example=0.18)

@router.post("")
def predict_reliability(payload: PredictRequest):
    res = predict_reliability_score(
        forecast_temp=payload.forecast_temperature,
        obs_temp=payload.observed_temperature,
        forecast_sal=payload.forecast_salinity,
        obs_sal=payload.observed_salinity,
        forecast_spd=payload.forecast_current_speed,
        obs_spd=payload.observed_current_speed
    )

    engine = get_db_engine()
    timestamp_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with engine.begin() as conn:
        # Save prediction into model_predictions table
        conn.execute(text("""
            INSERT INTO model_predictions (model_name, region_id, input_features, predicted_score, predicted_category, confidence_level, risk_level, timestamp)
            VALUES (:model_name, :region_id, :input_features, :predicted_score, :predicted_category, :confidence_level, :risk_level, CURRENT_TIMESTAMP);
        """), {
            "model_name": res["model_used"],
            "region_id": payload.region_id,
            "input_features": json.dumps(payload.dict()),
            "predicted_score": res["reliability_score"],
            "predicted_category": res["predicted_category"],
            "confidence_level": res["confidence_level"],
            "risk_level": res["risk_level"]
        })

        # Save into reliability_scores table
        conn.execute(text("""
            INSERT INTO reliability_scores (
                region_id, timestamp, latitude, longitude, depth,
                forecast_temperature, observed_temperature, temperature_bias,
                forecast_salinity, observed_salinity, salinity_bias,
                forecast_current_speed, observed_current_speed, current_bias,
                reliability_score, confidence_level, risk_level, model_name
            ) VALUES (
                :region_id, CURRENT_TIMESTAMP, :latitude, :longitude, :depth,
                :forecast_temp, :obs_temp, :temp_bias,
                :forecast_sal, :obs_sal, :sal_bias,
                :forecast_spd, :obs_spd, :current_bias,
                :score, :conf, :risk, :model_name
            );
        """), {
            "region_id": payload.region_id,
            "latitude": payload.latitude,
            "longitude": payload.longitude,
            "depth": payload.depth,
            "forecast_temp": payload.forecast_temperature,
            "obs_temp": payload.observed_temperature,
            "temp_bias": res["temp_bias"],
            "forecast_sal": payload.forecast_salinity,
            "obs_sal": payload.observed_salinity,
            "sal_bias": res["sal_bias"],
            "forecast_spd": payload.forecast_current_speed,
            "obs_spd": payload.observed_current_speed,
            "current_bias": res["current_bias"],
            "score": res["reliability_score"],
            "conf": res["confidence_level"],
            "risk": res["risk_level"],
            "model_name": res["model_used"]
        })

    return {
        "status": "success",
        "predicted_reliability_score": res["reliability_score"],
        "predicted_category": res["predicted_category"],
        "confidence_level": res["confidence_level"],
        "risk_level": res["risk_level"],
        "model_used": res["model_used"],
        "timestamp": timestamp_str
    }
