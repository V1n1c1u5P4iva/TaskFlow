from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, Any
from urllib.parse import quote_plus
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # aponta para taskflow-backend/
load_dotenv(BASE_DIR / ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "TaskFlow AI API"
    PROJECT_VERSION: str = "1.0.0"

    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DATABASE: str

    FRONTEND_URL: str
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        case_sensitive=True,
        extra="ignore"
    )

    def model_post_init(self, __context: Any) -> None: 
        if not self.DATABASE_URL:
            password = quote_plus(self.POSTGRES_PASSWORD) if self.POSTGRES_PASSWORD else ""
            auth = f"{self.POSTGRES_USER}:{password}" if password else self.POSTGRES_USER
            self.DATABASE_URL = (
                f"postgresql+psycopg2://{auth}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DATABASE}"
            )

settings = Settings()   # type: ignore
