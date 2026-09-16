from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/alerts", tags=["System Alerts"])

@router.get("")
def get_alerts(
    severity: Optional[str] = None,
    region_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.connect() as conn:
        conditions = []
        params = {"lim": limit}
        
        if severity:
            conditions.append("severity = :sev")
            params["sev"] = severity
        if region_id:
            conditions.append("region_id = :reg")
            params["reg"] = region_id

        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        query_str = f"SELECT * FROM alerts {where_clause} ORDER BY timestamp DESC LIMIT :lim;"
        
        result = conn.execute(text(query_str), params)
        rows = [dict(row._mapping) for row in result]
        
    return {"status": "success", "count": len(rows), "data": rows}
