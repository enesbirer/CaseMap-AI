from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


LegalCategory = Literal["İş Hukuku", "Kira Hukuku", "Tüketici Hukuku", "Borçlar Hukuku", "Aile Hukuku"]
RiskLevel = Literal["low", "medium", "high"]


class TimelineEvent(BaseModel):
    date: str | None = None
    event: str = Field(min_length=2, max_length=400)


class AnalysisOutput(BaseModel):
    legal_category: LegalCategory
    actors: list[str] = Field(default_factory=list, max_length=20)
    claim: str = Field(min_length=2, max_length=256)
    recommended_process: list[str] = Field(default_factory=list, max_length=20)
    risk_level: RiskLevel
    extracted_entities: dict = Field(default_factory=dict)
    timeline: list[TimelineEvent] = Field(default_factory=list)

