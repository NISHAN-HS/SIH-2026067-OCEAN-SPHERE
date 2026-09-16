import os
from sqlalchemy import create_engine, text
from backend.config.settings import settings

_engine = None
_engine_type = None

def get_db_engine():
    """Create and return a SQLAlchemy database engine targeting ocean_reliability_db with SQLite fallback."""
    global _engine, _engine_type
    if _engine is not None:
        return _engine

    pg_url = f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    try:
        engine = create_engine(pg_url, pool_pre_ping=True, connect_args={"connect_timeout": 3})
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        _engine = engine
        _engine_type = "POSTGRESQL"
        print(f"[DATABASE] Connected to PostgreSQL database '{settings.DB_NAME}' at {settings.DB_HOST}:{settings.DB_PORT}.")
        return _engine
    except Exception as e:
        print(f"[DATABASE] PostgreSQL connection failed: {e}")
        print(f"[DATABASE] Falling back to local SQLite database '{settings.SQLITE_PATH}'...")

    sqlite_url = f"sqlite:///{settings.SQLITE_PATH}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    _engine = engine
    _engine_type = "SQLITE"
    return _engine

def get_engine_type():
    global _engine_type
    if _engine_type is None:
        get_db_engine()
    return _engine_type
