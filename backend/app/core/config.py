from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "Prism Pilot"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./prism.db"

    # Keycloak / OIDC (optional for demo)
    KEYCLOAK_URL: str = ""
    KEYCLOAK_REALM: str = ""
    KEYCLOAK_CLIENT_ID: str = ""
    KEYCLOAK_CLIENT_SECRET: str = ""

    # LLM (optional, advisory only)
    LLM_API_KEY: str = ""
    LLM_PROVIDER: str = "openai-compatible"
    LLM_MODEL: str = ""
    LLM_BASE_URL: str = ""

    # Demo mode (localhost only, refuses in production)
    DEMO_MODE: bool = True


settings = Settings()