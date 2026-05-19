from __future__ import annotations

from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.ai.clients.base import LLMClient
from app.config.settings import settings
from app.utils.json_utils import extract_json_object


class OllamaClient(LLMClient):
    provider = "ollama"

    def __init__(self, model: str | None = None, base_url: str | None = None):
        self.model = model or settings.ollama_model
        self.base_url = base_url or settings.ollama_base_url

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat_json(self, *, system: str, user: str) -> dict[str, Any]:
        url = f"{self.base_url.rstrip('/')}/api/chat"
        payload = {
            "model": self.model,
            "stream": False,
            "format": "json",
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                resp = await client.post(url, json=payload)
                resp.raise_for_status()
                data = resp.json()
        except httpx.RequestError as exc:
            raise ValueError("Ollama servisine bağlanılamadı (OLLAMA_BASE_URL kontrol et)") from exc
        except httpx.HTTPStatusError as exc:
            raise ValueError("Ollama isteği başarısız (model adı ve servis loglarını kontrol et)") from exc
        content = (data.get("message") or {}).get("content") or "{}"
        return extract_json_object(content)
