from __future__ import annotations

import asyncio
import uuid
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Depends, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.transcription import transcribe_audio
from app.api.deps import get_current_user
from app.config.settings import settings
from app.database.session import get_db
from app.models.user import User
from app.schemas.case import CaseAnalyzeRequest, CaseAnalyzeResponse, TimelineEvent
from app.services.case_service import CaseService
from app.services.file_service import FileService
from app.services.indexing_service import IndexingService
from app.utils.file_utils import ensure_dir, sanitize_filename, sha256_bytes


router = APIRouter(prefix="/cases", tags=["cases"])


@router.post("/analyze", response_model=CaseAnalyzeResponse)
async def analyze_case(
    payload: CaseAnalyzeRequest,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CaseAnalyzeResponse:
    result = await CaseService(db).analyze_text_case(
        user_id=current_user.id,
        text=payload.text,
        provider=payload.provider,
        model=payload.model,
        retrieval=payload.retrieval,
        request=request,
        source="text",
    )
    return CaseAnalyzeResponse(
        case_id=result.case_id,
        legal_category=result.legal_category,
        actors=result.actors,
        claim=result.claim,
        recommended_process=result.recommended_process,
        risk_level=result.risk_level,
        extracted_entities=result.extracted_entities,
        timeline=[TimelineEvent(**e) for e in result.timeline],
        llm_provider=result.llm_provider,
        llm_model=result.llm_model,
        created_at=result.created_at,
    )


@router.post("/analyze-file", response_model=CaseAnalyzeResponse)
async def analyze_case_file(
    request: Request,
    file: UploadFile,
    provider: Literal["ollama", "openai"] | None = None,
    model: str | None = None,
    retrieval: bool = True,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CaseAnalyzeResponse:
    saved = await FileService(db).save_and_extract_text(current_user.id, file)
    await IndexingService(db).index_uploaded_file(saved)
    text_to_analyze = (saved.extracted_text or "")[:20_000]
    if len(text_to_analyze.strip()) < 3:
        raise ValueError("Dosyadan yeterli metin çıkarılamadı")

    result = await CaseService(db).analyze_text_case(
        user_id=current_user.id,
        text=text_to_analyze,
        provider=provider,
        model=model,
        retrieval=retrieval,
        request=request,
        source="file",
    )
    return CaseAnalyzeResponse(
        case_id=result.case_id,
        legal_category=result.legal_category,
        actors=result.actors,
        claim=result.claim,
        recommended_process=result.recommended_process,
        risk_level=result.risk_level,
        extracted_entities=result.extracted_entities,
        timeline=[TimelineEvent(**e) for e in result.timeline],
        llm_provider=result.llm_provider,
        llm_model=result.llm_model,
        created_at=result.created_at,
    )


SUPPORTED_AUDIO_TYPES = {
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/webm",
}


@router.post("/analyze-audio", response_model=CaseAnalyzeResponse)
async def analyze_case_audio(
    request: Request,
    audio: UploadFile,
    provider: Literal["ollama", "openai"] | None = None,
    model: str | None = None,
    retrieval: bool = True,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> CaseAnalyzeResponse:
    if audio.content_type not in SUPPORTED_AUDIO_TYPES:
        raise ValueError("Desteklenmeyen ses formatı")
    raw = await audio.read()
    if not raw:
        raise ValueError("Boş ses dosyası")
    if len(raw) > 25 * 1024 * 1024:
        raise ValueError("Ses dosyası boyutu limitini aşıyor")

    ensure_dir(settings.upload_dir)
    fname = sanitize_filename(audio.filename or "ses")
    storage_path = (settings.upload_dir / f"{uuid.uuid4()}_{fname}").resolve()
    await asyncio.to_thread(storage_path.write_bytes, raw)
    _ = sha256_bytes(raw)

    try:
        text = await transcribe_audio(Path(storage_path))
    except RuntimeError as exc:
        raise ValueError(str(exc)) from exc
    if len(text.strip()) < 3:
        raise ValueError("Ses çözümlenemedi")

    result = await CaseService(db).analyze_text_case(
        user_id=current_user.id,
        text=text[:20_000],
        provider=provider,
        model=model,
        retrieval=retrieval,
        request=request,
        source="audio",
    )
    return CaseAnalyzeResponse(
        case_id=result.case_id,
        legal_category=result.legal_category,
        actors=result.actors,
        claim=result.claim,
        recommended_process=result.recommended_process,
        risk_level=result.risk_level,
        extracted_entities=result.extracted_entities,
        timeline=[TimelineEvent(**e) for e in result.timeline],
        llm_provider=result.llm_provider,
        llm_model=result.llm_model,
        created_at=result.created_at,
    )
