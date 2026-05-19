from __future__ import annotations

from typing import Literal

from app.ai.clients.ollama_client import OllamaClient
from app.ai.clients.openai_client import OpenAIClient
from app.config.settings import settings


Provider = Literal["ollama", "openai"]


def get_llm_client(provider: Provider | None = None, model: str | None = None):
    resolved_provider: Provider = provider or settings.llm_provider_default
    if provider and not settings.allow_provider_override:
        resolved_provider = settings.llm_provider_default

    if resolved_provider == "openai":
        return OpenAIClient(model=model)
    return OllamaClient(model=model)

