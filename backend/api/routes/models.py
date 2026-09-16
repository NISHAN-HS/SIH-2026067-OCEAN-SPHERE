from fastapi import APIRouter
from sqlalchemy import text
from backend.database.connection import get_db_engine

router = APIRouter(prefix="/models", tags=["Trained Models Metadata"])

@router.get("")
def get_trained_models():
    engine = get_db_engine()
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM trained_models ORDER BY accuracy DESC;"))
        rows = [dict(row._mapping) for row in result]
    return {"status": "success", "count": len(rows), "models": rows}
