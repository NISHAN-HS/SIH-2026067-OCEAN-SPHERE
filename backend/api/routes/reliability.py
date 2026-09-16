from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/reliability", tags=["Reliability Scores"])

@router.get("")
def get_reliability_scores(
    region_id: Optional[str] = None,
    min_score: Optional[float] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.connect() as conn:
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
