from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("legal_cases.id"), unique=True, nullable=False)

    legal_category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    claim: Mapped[str] = mapped_column(String(256), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(16), index=True, nullable=False)

    actors: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_process: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    extracted_entities: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    timeline: Mapped[list[dict]] = mapped_column(JSON, default=list, nullable=False)

    llm_provider: Mapped[str] = mapped_column(String(32), nullable=False)
    llm_model: Mapped[str] = mapped_column(String(128), nullable=False)
    raw_json: Mapped[dict] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    case = relationship("LegalCase", back_populates="analysis_result", lazy="joined")
