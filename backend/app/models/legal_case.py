from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class CaseSource(str, enum.Enum):
    text = "text"
    file = "file"
    audio = "audio"


class LegalCase(Base):
    __tablename__ = "legal_cases"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)

    source: Mapped[CaseSource] = mapped_column(Enum(CaseSource, name="case_source"), nullable=False)
    input_text: Mapped[str] = mapped_column(Text, nullable=False)
    input_language: Mapped[str] = mapped_column(String(16), default="tr", nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", lazy="joined")
    analysis_result = relationship("AnalysisResult", back_populates="case", uselist=False, lazy="selectin")
