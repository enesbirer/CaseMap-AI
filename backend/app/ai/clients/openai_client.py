from __future__ import annotations

from typing import Any

from openai import AsyncOpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config.settings import settings
from app.utils.json_utils import extract_json_object
from app.ai.clients.base import LLMClient


class OpenAIClient(LLMClient):
    provider = "openai"

    def __init__(self, model: str | None = None):
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY tanımlı değil")
        self.model = model or settings.openai_model
        self._client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url or None)

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.5, max=4))
    async def chat_json(self, *, system: str, user: str) -> dict[str, Any]:
        try:
            resp = await self._client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
                response_format={"type": "json_object"},
            )
        except Exception as exc:
            raise ValueError("OpenAI isteği başarısız (OPENAI_API_KEY/model/base_url kontrol et)") from exc
        content = resp.choices[0].message.content or "{}"
        return extract_json_object(content)
