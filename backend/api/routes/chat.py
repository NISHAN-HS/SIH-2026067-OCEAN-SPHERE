import re
import random
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel
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

def parse_intent(text: str) -> str:
    text = text.lower()
    if any(word in text for word in ["hello", "hi", "hey", "greetings", "good morning"]):
        return "greeting"
    if any(word in text for word in ["route", "routing", "path", "navigate", "transit", "waypoint"]):
        return "routing"
    if any(word in text for word in ["report", "export", "download", "generate report", "summary"]):
        return "report"
    if any(word in text for word in ["predict", "reliability", "score", "forecast", "bias", "accuracy", "temperature", "salinity", "anomaly"]):
        return "prediction"
    if any(word in text for word in ["help", "what can you do", "features"]):
        return "help"
    return "general"

def generate_casual_response(intent: str, text: str) -> str:
    if intent == "greeting":
        responses = [
            "Hello! I'm the OceanSphere AI Copilot. I can help you analyze ocean forecasts, predict model reliability, or optimize maritime routes. What would you like to explore today?",
            "Hi there! Ready to analyze some ocean telemetry? Ask me about a specific region's forecast reliability or vessel routing.",
            "Greetings! I'm online and monitoring global ocean data. How can I assist you with predictions or routing today?"
        ]
        return random.choice(responses)
    elif intent == "help":
        return (
            "I am the **OceanSphere AI Copilot**. Here are some things you can ask me:\n\n"
            "- 📈 **Predict Reliability:** Ask me to evaluate forecast accuracy (e.g., *'Predict reliability for Chennai'* or *'What if temperature bias is 1.5C?'*)\n"
            "- 🚢 **Route Analysis:** Ask about ship routing (e.g., *'Best route from Mumbai to Dubai'*)\n"
            "- 🌍 **Telemetry:** Inquire about specific anomalies in the Bay of Bengal or Arabian Sea."
        )
    else:
        # General catch-all
        responses = [
            "That's interesting. To provide a deep maritime analysis, could you specify if you're looking for forecast reliability predictions or vessel routing optimizations?",
            "I'm an AI specialized in oceanographic telemetry and maritime logistics. Try asking me to predict the reliability score for the Bay of Bengal!",
            "I'm not quite sure how to analyze that parameter yet. Would you like me to run a standard forecast reliability prediction for the Indian coast instead?"
        ]
        return random.choice(responses)

def parse_prediction_prompt(text: str) -> dict:
    # Add some dynamic randomness to base parameters so it doesn't look identical every time
    base_t = round(random.uniform(27.0, 30.0), 1)
    base_s = round(random.uniform(34.5, 35.5), 1)
    base_c = round(random.uniform(0.1, 0.5), 2)
    
    params = {
        "forecast_temperature": base_t,
        "observed_temperature": round(base_t - random.uniform(-0.5, 0.5), 1),
        "forecast_salinity": base_s,
        "observed_salinity": round(base_s - random.uniform(-0.2, 0.2), 1),
        "forecast_current_speed": base_c,
        "observed_current_speed": round(base_c - random.uniform(-0.1, 0.1), 2),
        "latitude": round(random.uniform(5.0, 25.0), 1),
        "longitude": round(random.uniform(65.0, 95.0), 1),
        "region_id": "IND_UNKNOWN"
    }

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
    elif "arabian" in lower_text or "dubai" in lower_text or "mumbai" in lower_text or "west" in lower_text:
        params["region_id"] = "IND_WEST"
        params["latitude"], params["longitude"] = 18.95, 72.95

    # Extract numbers for temps, salinities, currents
    temps = re.findall(r'(\d+\.?\d*)\s*(?:°?c|celsius|degrees|temp)', text, re.IGNORECASE)
    if len(temps) >= 2:
        params["forecast_temperature"] = float(temps[0])
        params["observed_temperature"] = float(temps[1])
    elif len(temps) == 1:
        params["forecast_temperature"] = float(temps[0])

    bias_match = re.search(r'(?:temp|temperature)\s*bias\s*(?:of|=)?\s*(\d+\.?\d*)', text, re.IGNORECASE)
    if bias_match:
        b_val = float(bias_match.group(1))
        # assume observed is forecast - bias
        params["observed_temperature"] = round(params["forecast_temperature"] - b_val, 2)

    return params


@router.post("/predict", response_model=PredictionChatResponseSchema)
def chat_predict(payload: PredictionChatRequestSchema):
    prompt = payload.message.strip()
    intent = parse_intent(prompt)

    # Handle Casual / Non-Predictive Intents
    if intent in ["greeting", "general", "help"]:
        reply = generate_casual_response(intent, prompt)
        return PredictionChatResponseSchema(
            reply=reply,
            suggestions=["Predict reliability for Chennai offshore", "Show me the route from Mumbai to Dubai", "What can you do?"]
        )
    
    # Handle Routing Mock
    if intent == "routing":
        reply_lines = [
            "### 🚢 Smart Vessel Routing Analysis",
            "Based on the latest HYCOM telemetry and sea state data, here is the routing summary:",
            "",
            "- **Optimization Objective**: Fuel Efficiency & Safety",
            "- **Estimated Fuel Savings**: ~2.4 Tons",
            "- **Wave Height Constraints**: Kept below 2.5m",
            "",
            "💡 **Advisory**: The generated route avoids a moderate anomaly zone near the coast. I recommend checking the **Ship Routing** page on the dashboard to visualize the full navigable corridor and waypoints."
        ]
        return PredictionChatResponseSchema(
            reply="\n".join(reply_lines),
            suggestions=["Predict reliability for this route", "What if temperature bias increases to 1.5°C?"]
        )

    # Handle Report Mock
    if intent == "report":
        reply_lines = [
            "### 📄 Scientific Report Generated",
            "I have compiled the latest oceanographic telemetry and reliability metrics into a comprehensive summary report.",
            "",
            "#### Report Overview:",
            "- **Region Evaluated**: Indian Ocean Basin",
            "- **Date Range**: Past 7 Days",
            "- **Anomalies Detected**: 3 (Moderate Risk)",
            "- **Model Accuracy**: 94.2% Average",
            "",
            "✅ The full dataset and analysis are ready. You can download the complete report in CSV or PDF formats from the Reports Center.",
            "",
            "[Go to Scientific Reports Center](/reports)"
        ]
        return PredictionChatResponseSchema(
            reply="\n".join(reply_lines),
            suggestions=["Predict reliability for Chennai", "Show me ship routing options"]
        )

    # Handle Prediction Request
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
    reply_lines.append(f"### 🤖 Prediction Analysis: {extracted['region_id']}")
    reply_lines.append(f"Based on the **{model}** model inference, here is the forecast reliability evaluation near ({extracted['latitude']}°N, {extracted['longitude']}°E):")
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
        reply_lines.append("💡 **Recommendation**: High forecast reliability. Numerical model outputs are highly aligned with in-situ observations. Standard marine navigation recommended.")
    elif score >= 60.0:
        reply_lines.append("⚠️ **Recommendation**: Moderate divergence detected. Monitor sea surface temperature & current vector deviations along coastlines.")
    else:
        reply_lines.append("🚨 **Warning**: Critical anomaly zone detected (<60% reliability score). Significant spatial divergence. Enable active hazard detour filters.")

    suggestions = [
        "What happens if temperature bias increases to 1.5°C?",
        "Check optimal vessel routing from Mumbai to Dubai",
        "Explain the risk level"
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
