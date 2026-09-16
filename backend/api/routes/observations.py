from fastapi import APIRouter, Query
from typing import Optional
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/observations", tags=["Observation Data"])

@router.get("")
def get_observation_data(
    source_type: Optional[str] = None,
    limit: int = Query(100, ge=1, le=1000)
):
    engine = get_db_engine()
    with engine.connect() as conn:
        if source_type:
            query = text("SELECT * FROM observation_data WHERE source_type = :src ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"src": source_type, "lim": limit})
        else:
            query = text("SELECT * FROM observation_data ORDER BY timestamp DESC LIMIT :lim;")
            result = conn.execute(query, {"lim": limit})
        
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "data": rows}
