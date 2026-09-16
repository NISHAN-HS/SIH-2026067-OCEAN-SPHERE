import os

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            pass

class Settings:
    PROJECT_NAME: str = "OceanSphere - Ocean Forecast Reliability System"
    VERSION: str = "2.0.0"
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    
    DB_TYPE: str = os.getenv("DB_TYPE", "postgresql")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_NAME: str = os.getenv("DB_NAME", "ocean_reliability_db")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "nandith")
    SQLITE_PATH: str = os.getenv("SQLITE_PATH", "ocean_reliability_db.db")

settings = Settings()
