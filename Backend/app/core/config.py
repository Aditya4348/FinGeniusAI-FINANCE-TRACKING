from functools import lru_cache
from typing import Literal
from pydantic import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # app settings
    APP_NAME: str = "FastAPI App"
    ENVIRONMENT: Literal["development", "production", "staging"] = "development"
    DEBUG: bool = True
    
    # JWT settings
    JWT_SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    
    # Database settings
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int = 5432
    DB_NAME: str
    
    # Eksternal API settings
    GEMINI_API_KEY: str
    
    # pydantic config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
@lru_cache()
def get_settings() -> Settings:
    return Settings()

# deklarasi Singleton settings
settings = get_settings()
    