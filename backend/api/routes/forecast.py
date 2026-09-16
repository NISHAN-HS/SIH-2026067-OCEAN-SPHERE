from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/forecast", tags=["Forecast Data"])

@router.get("")
def get_forecast_data(
    region_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.connect() as conn:
        if region_id:
            query = text("SELECT * FROM forecast_data WHERE region_id = :reg ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"reg": region_id, "lim": limit})
        else:
            query = text("SELECT * FROM forecast_data ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"lim": limit})
        
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "data": rows}
