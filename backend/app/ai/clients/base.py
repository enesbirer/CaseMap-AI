from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class LLMClient(ABC):
    provider: str
    model: str

    @abstractmethod
    async def chat_json(self, *, system: str, user: str) -> dict[str, Any]:
        raise NotImplementedError

