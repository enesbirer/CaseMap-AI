from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import Literal

from fastapi import Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.pipeline.analysis_engine import AnalysisEngine
from app.ai.router import Provider
from app.models.analysis_result import AnalysisResult
from app.models.legal_case import CaseSource, LegalCase
from app.services.audit_service import AuditService
from app.services.retrieval_service import RetrievalService
from app.utils.text_utils import safe_excerpt


class CaseService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.engine = AnalysisEngine()

    async def analyze_text_case(
        self,
        *,
        user_id: uuid.UUID,
        text: str,
        provider: Provider | None,
        model: str | None,
        retrieval: bool,
        request: Request | None = None,
        source: Literal["text", "file", "audio"] = "text",
    ) -> AnalysisResult:
        case = LegalCase(user_id=user_id, source=CaseSource(source), input_text=text, input_language="tr")
        self.db.add(case)
        await self.db.commit()
        await self.db.refresh(case)

        retrieval_context = None
        if retrieval:
            retrieval_context = await RetrievalService(self.db).retrieve_context(text)

        out, used_provider, used_model = await self.engine.analyze(
            text=text, provider=provider, model=model, retrieval_context=retrieval_context
        )

        result = AnalysisResult(
            case_id=case.id,
            legal_category=out.legal_category,
            claim=out.claim,
            risk_level=out.risk_level,
            actors=out.actors,
            recommended_process=out.recommended_process,
            extracted_entities=out.extracted_entities,
            timeline=[e.model_dump() for e in out.timeline],
            llm_provider=used_provider,
            llm_model=used_model,
            raw_json=out.model_dump(),
        )
        self.db.add(result)
        await self.db.commit()
        await self.db.refresh(result)

        if request is not None:
            await AuditService(self.db).log(
                "case.analyze",
                user_id=user_id,
                ip=request.client.host if request.client else None,
                user_agent=request.headers.get("user-agent"),
                payload={
                    "case_id": str(case.id),
                    "source": source,
                    "excerpt": safe_excerpt(text, 220),
                    "llm_provider": used_provider,
                    "llm_model": used_model,
                    "created_at": datetime.now(UTC).isoformat(),
                },
            )
        return result
