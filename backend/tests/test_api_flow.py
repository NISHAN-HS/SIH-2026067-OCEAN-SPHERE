import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi.testclient import TestClient
from sqlalchemy import text
from backend.main import app
from backend.database.connection import get_db_engine, get_engine_type

client = TestClient(app)

def test_backend_e2e_flow():
    print("=" * 75)
    print("  OCEANSPHERE BACKEND TEST SUITE")
    print("=" * 75)
    
    engine = get_db_engine()
    engine_type = get_engine_type()
    print(f"[1] Database engine connected: {engine_type}")

    # Check root endpoint
    res = client.get("/")
    assert res.status_code == 200
    print(f"[2] Root endpoint status: {res.status_code} | Engine: {res.json().get('database_engine')}")

    # Check GET endpoints
    endpoints = ["/regions", "/forecast", "/observations", "/reliability", "/alerts", "/sources", "/models"]
    for ep in endpoints:
        r = client.get(ep)
        assert r.status_code == 200
        print(f"[3] GET {ep:<15} -> Status 200 | Records: {len(r.json().get('data', r.json().get('regions', r.json().get('sources', r.json().get('models', [])))))}")

    # Check POST /predict
    payload = {
        "region_id": "IND_WEST",
        "latitude": 15.5,
        "longitude": 72.5,
        "depth": 0.0,
        "forecast_temperature": 28.5,
        "observed_temperature": 28.2,
        "forecast_salinity": 35.1,
        "observed_salinity": 35.0,
        "forecast_current_speed": 0.20,
        "observed_current_speed": 0.18
    }
    pr = client.post("/predict", json=payload)
    assert pr.status_code == 200
    pdata = pr.json()
    print(f"[4] POST /predict status: 200 | Reliability Score: {pdata.get('predicted_reliability_score')}% ({pdata.get('predicted_category')})")

    print("=" * 75)
    print("  OCEANSPHERE BACKEND VERIFICATION: 100% SUCCESS")
    print("=" * 75)

if __name__ == "__main__":
    test_backend_e2e_flow()
