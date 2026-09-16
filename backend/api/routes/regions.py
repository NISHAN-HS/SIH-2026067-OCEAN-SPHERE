from fastapi import APIRouter
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/regions", tags=["Regions"])

@router.get("")
def get_regions():
    engine = get_db_engine()
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, region_id, name, lat_min, lat_max, lon_min, lon_max FROM regions ORDER BY id;"))
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "regions": rows}
