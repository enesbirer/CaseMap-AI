from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "CaseMap AI"
    environment: Literal["local", "dev", "staging", "prod"] = "local"
    api_v1_prefix: str = "/api/v1"

    database_url: str = Field(
        default="postgresql+asyncpg://casemap:casemap@localhost:5432/casemap",
        description="SQLAlchemy async URL",
    )

    jwt_secret_key: str = Field(default="change-me", min_length=16)
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = 60 * 12

    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    rate_limit_default: str = "60/minute"

    upload_dir: Path = Field(default=Path("./data/uploads"))
    max_upload_mb: int = 15

    llm_provider_default: Literal["ollama", "openai"] = "ollama"
    allow_provider_override: bool = True

    openai_api_key: str | None = None
    openai_base_url: str | None = None
    openai_model: str = "gpt-4o-mini"

    ollama_base_url: str = "http://ollama:11434"
    ollama_model: str = "llama3.1:8b"

    embedding_model_name: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    faiss_index_path: Path = Field(default=Path("./data/faiss/index.faiss"))
    faiss_metadata_path: Path = Field(default=Path("./data/faiss/metadata.json"))
    retrieval_top_k: int = 5


settings = Settings()
