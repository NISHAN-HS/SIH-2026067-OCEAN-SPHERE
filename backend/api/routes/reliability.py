from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/reliability", tags=["Reliability Scores"])

SEED_RELIABILITY_RECORDS = [
    {"region_id": "IND_WEST", "latitude": 15.5, "longitude": 72.5, "depth": 0.0, "forecast_temp": 28.5, "obs_temp": 28.2, "temp_bias": 0.3, "forecast_sal": 35.1, "obs_sal": 35.0, "sal_bias": 0.1, "forecast_spd": 0.40, "obs_spd": 0.38, "current_bias": 0.02, "score": 94.2, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_EAST", "latitude": 17.5, "longitude": 84.5, "depth": 0.0, "forecast_temp": 28.8, "obs_temp": 28.4, "temp_bias": 0.4, "forecast_sal": 34.2, "obs_sal": 34.0, "sal_bias": 0.2, "forecast_spd": 0.50, "obs_spd": 0.46, "current_bias": 0.04, "score": 89.5, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_SOUTH", "latitude": 6.5, "longitude": 78.0, "depth": 0.0, "forecast_temp": 27.2, "obs_temp": 27.0, "temp_bias": 0.2, "forecast_sal": 35.4, "obs_sal": 35.2, "sal_bias": 0.2, "forecast_spd": 0.35, "obs_spd": 0.32, "current_bias": 0.03, "score": 96.0, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_ANDAMAN", "latitude": 11.6, "longitude": 92.7, "depth": 0.0, "forecast_temp": 29.1, "obs_temp": 28.6, "temp_bias": 0.5, "forecast_sal": 33.8, "obs_sal": 33.4, "sal_bias": 0.4, "forecast_spd": 0.48, "obs_spd": 0.42, "current_bias": 0.06, "score": 82.4, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_GUJARAT", "latitude": 21.5, "longitude": 69.5, "depth": 0.0, "forecast_temp": 26.5, "obs_temp": 26.1, "temp_bias": 0.4, "forecast_sal": 36.2, "obs_sal": 35.9, "sal_bias": 0.3, "forecast_spd": 0.60, "obs_spd": 0.54, "current_bias": 0.06, "score": 86.8, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_TAMILNADU", "latitude": 10.2, "longitude": 79.8, "depth": 0.0, "forecast_temp": 29.0, "obs_temp": 28.3, "temp_bias": 0.7, "forecast_sal": 34.5, "obs_sal": 34.1, "sal_bias": 0.4, "forecast_spd": 0.52, "obs_spd": 0.45, "current_bias": 0.07, "score": 79.1, "conf": "Medium Confidence", "risk": "Moderate Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_WEST", "latitude": 18.9, "longitude": 71.8, "depth": 0.0, "forecast_temp": 27.8, "obs_temp": 27.5, "temp_bias": 0.3, "forecast_sal": 35.3, "obs_sal": 35.1, "sal_bias": 0.2, "forecast_spd": 0.44, "obs_spd": 0.41, "current_bias": 0.03, "score": 92.5, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_EAST", "latitude": 13.1, "longitude": 81.5, "depth": 0.0, "forecast_temp": 28.4, "obs_temp": 27.8, "temp_bias": 0.6, "forecast_sal": 34.6, "obs_sal": 34.0, "sal_bias": 0.6, "forecast_spd": 0.58, "obs_spd": 0.48, "current_bias": 0.10, "score": 76.4, "conf": "Medium Confidence", "risk": "Moderate Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_SOUTH", "latitude": 4.5, "longitude": 75.2, "depth": 0.0, "forecast_temp": 28.1, "obs_temp": 27.9, "temp_bias": 0.2, "forecast_sal": 35.0, "obs_sal": 34.9, "sal_bias": 0.1, "forecast_spd": 0.30, "obs_spd": 0.28, "current_bias": 0.02, "score": 97.1, "conf": "High Confidence", "risk": "Low Risk", "model_name": "Gradient Boosting"},
    {"region_id": "IND_ANDAMAN", "latitude": 9.2, "longitude": 93.5, "depth": 0.0, "forecast_temp": 29.5, "obs_temp": 28.8, "temp_bias": 0.7, "forecast_sal": 33.2, "obs_sal": 32.5, "sal_bias": 0.7, "forecast_spd": 0.65, "obs_spd": 0.52, "current_bias": 0.13, "score": 71.8, "conf": "Medium Confidence", "risk": "Moderate Risk", "model_name": "Gradient Boosting"},
]

@router.get("")
def get_reliability_scores(
    region_id: Optional[str] = None,
    min_score: Optional[float] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.begin() as conn:
        # Check count
        count_res = conn.execute(text("SELECT COUNT(*) FROM reliability_scores;")).scalar()
        if not count_res or count_res == 0:
            # Seed default records
            for r in SEED_RELIABILITY_RECORDS:
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
                """), r)

        sql = "SELECT * FROM reliability_scores WHERE 1=1"
        params = {"lim": limit}
        if region_id:
            sql += " AND region_id = :reg"
            params["reg"] = region_id
        if min_score is not None:
            sql += " AND reliability_score >= :min_s"
            params["min_s"] = min_score
        sql += " ORDER BY timestamp DESC LIMIT :lim;"
        
        result = conn.execute(text(sql), params)
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "data": rows}
