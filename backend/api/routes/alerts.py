from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/alerts", tags=["System Alerts"])

@router.get("")
def get_alerts(
    severity: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.connect() as conn:
        if severity:
            query = text("SELECT * FROM alerts WHERE severity = :sev ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"sev": severity, "lim": limit})
        else:
            query = text("SELECT * FROM alerts ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"lim": limit})
        
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "data": rows}
