from fastapi import APIRouter
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/sources", tags=["Data Sources Metadata"])

@router.get("")
def get_data_sources():
    engine = get_db_engine()
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM data_sources ORDER BY id;"))
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "sources": rows}
