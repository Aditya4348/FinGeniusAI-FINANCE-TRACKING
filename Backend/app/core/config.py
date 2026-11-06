from functools import lru_cache
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "FinGenius AI Backend"
    ENVIRONMENT: Literal["development", "production", "staging"] = "development"
    DEBUG: bool = True

    # JWT settings (dengan fallback default aman)
    JWT_SECRET_KEY: str = "b93f18e90d24c08e5c1bb82d61d120a1127e3bf8e29a9e324005b4e7829a2df9"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 hari

    # Database settings
    DB_USER: str = "root"
    DB_PASSWORD: str = "secretpassword"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "mobile_app_db"

    # Eksternal API settings
    GEMINI_API_KEY: str = ""

    # Pydantic config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+psycopg2://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Deklarasi Singleton settings
settings = get_settings()
