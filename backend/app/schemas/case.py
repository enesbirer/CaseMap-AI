from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class CaseAnalyzeRequest(BaseModel):
    text: str = Field(min_length=3, max_length=20_000)
    provider: Literal["ollama", "openai"] | None = None
    model: str | None = None
    retrieval: bool = True


class TimelineEvent(BaseModel):
    date: str | None = None
    event: str


class CaseAnalyzeResponse(BaseModel):
    case_id: uuid.UUID
    legal_category: str
    actors: list[str]
    claim: str
    recommended_process: list[str]
    risk_level: Literal["low", "medium", "high"]
    extracted_entities: dict
    timeline: list[TimelineEvent]
    llm_provider: str
    llm_model: str
    created_at: datetime

