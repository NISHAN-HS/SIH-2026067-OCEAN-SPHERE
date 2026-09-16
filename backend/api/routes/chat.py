import re
import json
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field
from backend.ml.prediction.predict import predict_reliability_score

router = APIRouter(prefix="/chat", tags=["AI Prediction Copilot"])

class ChatMessageSchema(BaseModel):
    sender: str  # 'user' | 'assistant'
    text: str
    timestamp: Optional[str] = None

class PredictionChatRequestSchema(BaseModel):
    message: str
    history: Optional[List[ChatMessageSchema]] = []

class PredictionChatResponseSchema(BaseModel):
    reply: str
    predicted_reliability_score: Optional[float] = None
    predicted_category: Optional[str] = None
    risk_level: Optional[str] = None
    confidence_level: Optional[str] = None
    extracted_params: Optional[dict] = None
    suggestions: List[str] = []


def parse_prediction_prompt(text: str) -> dict:
    """Extract numeric parameters, region, and intent from natural language prompt."""
    params = {
        "forecast_temperature": 28.5,
        "observed_temperature": 28.2,
        "forecast_salinity": 35.1,
        "observed_salinity": 35.0,
        "forecast_current_speed": 0.22,
        "observed_current_speed": 0.19,
        "latitude": 15.5,
        "longitude": 72.5,
        "region_id": "IND_WEST"
    }

    # Region detection
    lower_text = text.lower()
    if "east" in lower_text or "bay of bengal" in lower_text or "chennai" in lower_text:
        params["region_id"] = "IND_EAST"
        params["latitude"], params["longitude"] = 13.08, 80.29
    elif "south" in lower_text or "cochin" in lower_text or "kochi" in lower_text:
        params["region_id"] = "IND_SOUTH"
        params["latitude"], params["longitude"] = 9.96, 76.27
    elif "andaman" in lower_text or "port blair" in lower_text:
        params["region_id"] = "IND_ANDAMAN"
        params["latitude"], params["longitude"] = 11.66, 92.74
    elif "gujarat" in lower_text or "kandla" in lower_text:
        params["region_id"] = "IND_GUJARAT"
        params["latitude"], params["longitude"] = 23.00, 70.22
    elif "arabian" in lower_text or "dubai" in lower_text:
        params["region_id"] = "IND_NORTH_ARABIAN"
        params["latitude"], params["longitude"] = 24.99, 55.06

    # Extract numbers for temps, salinities, currents
    # Look for temp patterns e.g., "temp 29.1" or "28.5C vs 28.1C"
    temps = re.findall(r'(\d+\.?\d*)\s*(?:°?c|celsius|degrees|temp)', text, re.IGNORECASE)
    if len(temps) >= 2:
        params["forecast_temperature"] = float(temps[0])
        params["observed_temperature"] = float(temps[1])
    elif len(temps) == 1:
        params["forecast_temperature"] = float(temps[0])

    # Look for lat/lon patterns e.g. "15.5N, 72.5E" or "lat 12.5"
    lat_match = re.search(r'(\d+\.?\d*)\s*°?\s*N', text, re.IGNORECASE)
    lon_match = re.search(r'(\d+\.?\d*)\s*°?\s*E', text, re.IGNORECASE)
    if lat_match:
        params["latitude"] = float(lat_match.group(1))
    if lon_match:
        params["longitude"] = float(lon_match.group(1))

    # Look for bias terms e.g., "temp bias 0.8"
    bias_match = re.search(r'(?:temp|temperature)\s*bias\s*(?:of|=)?\s*(\d+\.?\d*)', text, re.IGNORECASE)
    if bias_match:
        b_val = float(bias_match.group(1))
        params["observed_temperature"] = round(params["forecast_temperature"] - b_val, 2)

    return params


@router.post("/predict", response_model=PredictionChatResponseSchema)
def chat_predict(payload: PredictionChatRequestSchema):
    prompt = payload.message.strip()
    extracted = parse_prediction_prompt(prompt)

    # Run ML prediction pipeline
    res = predict_reliability_score(
        forecast_temp=extracted["forecast_temperature"],
        obs_temp=extracted["observed_temperature"],
        forecast_sal=extracted["forecast_salinity"],
        obs_sal=extracted["observed_salinity"],
        forecast_spd=extracted["forecast_current_speed"],
        obs_spd=extracted["observed_current_speed"]
    )

    score = res["reliability_score"]
    cat = res["predicted_category"]
    risk = res["risk_level"]
    conf = res["confidence_level"]
    model = res["model_used"]

    # Construct rich conversational response markdown
    reply_lines = []
    reply_lines.append(f"### 🤖 OceanSphere AI Prediction Analysis")
    reply_lines.append(f"Based on gradient boosting model inference (**{model}**), here is the forecast reliability evaluation for **{extracted['region_id']}** ({extracted['latitude']}°N, {extracted['longitude']}°E):")
    reply_lines.append("")
    reply_lines.append(f"- 🎯 **Predicted Reliability Score**: **{score}%** ({cat})")
    reply_lines.append(f"- 🛡️ **Operational Risk Level**: **{risk}**")
    reply_lines.append(f"- ⚡ **Model Confidence**: {conf}")
    reply_lines.append("")
    reply_lines.append("#### 📊 Model Feature Bias Analysis:")
    reply_lines.append(f"- **Temperature Bias**: `{res['temp_bias']}°C` (HYCOM: {extracted['forecast_temperature']}°C | Observed: {extracted['observed_temperature']}°C)")
    reply_lines.append(f"- **Salinity Bias**: `{res['sal_bias']} PSU` (HYCOM: {extracted['forecast_salinity']} PSU | Observed: {extracted['observed_salinity']} PSU)")
    reply_lines.append(f"- **Current Speed Bias**: `{res['current_bias']} m/s` (HYCOM: {extracted['forecast_current_speed']} m/s | Observed: {extracted['observed_current_speed']} m/s)")
    reply_lines.append("")

    if score >= 80.0:
        reply_lines.append("💡 **Recommendation**: High forecast reliability grid. Numerical model outputs are highly aligned with in-situ Argo/buoy observations. Standard marine navigation and vessel routing parameters recommended.")
    elif score >= 60.0:
        reply_lines.append("⚠️ **Recommendation**: Moderate divergence detected. Monitor sea surface temperature & current vector deviations along coastlines. Apply +0.5 knot buffer on vessel speed estimations.")
    else:
        reply_lines.append("🚨 **Warning**: Critical anomaly zone detected (<60% reliability score). Significant spatial divergence between HYCOM model and satellite/buoy telemetry. Avoid high-speed transit and enable active hazard detour filters.")

    suggestions = [
        "What happens if temperature bias increases to 1.5°C?",
        "Predict reliability for Chennai offshore (IND_EAST)",
        "How does salinity divergence impact forecast accuracy?",
        "Check optimal vessel routing from Mumbai to Dubai"
    ]

    return PredictionChatResponseSchema(
        reply="\n".join(reply_lines),
        predicted_reliability_score=score,
        predicted_category=cat,
        risk_level=risk,
        confidence_level=conf,
        extracted_params=extracted,
        suggestions=suggestions
    )
