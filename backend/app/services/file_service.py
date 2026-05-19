from __future__ import annotations

import asyncio
import uuid
from pathlib import Path

from fastapi import UploadFile
from pypdf import PdfReader
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import settings
from app.models.uploaded_file import UploadedFile
from app.utils.file_utils import ensure_dir, sanitize_filename, sha256_bytes
from docx import Document


SUPPORTED_DOC_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}


class FileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def save_and_extract_text(self, user_id: uuid.UUID, upload: UploadFile) -> UploadedFile:
        if upload.content_type not in SUPPORTED_DOC_CONTENT_TYPES:
            raise ValueError("Desteklenmeyen dosya türü")

        raw = await upload.read()
        if not raw:
            raise ValueError("Boş dosya")
        if len(raw) > settings.max_upload_mb * 1024 * 1024:
            raise ValueError("Dosya boyutu limitini aşıyor")

        sha256 = sha256_bytes(raw)
        original_name = sanitize_filename(upload.filename or "dosya")
        ensure_dir(settings.upload_dir)

        stored_name = f"{uuid.uuid4()}_{original_name}"
        storage_path = (settings.upload_dir / stored_name).resolve()
        await asyncio.to_thread(storage_path.write_bytes, raw)

        extracted_text = await self._extract_text(storage_path, upload.content_type)

        record = UploadedFile(
            user_id=user_id,
            filename=original_name,
            content_type=upload.content_type,
            size_bytes=len(raw),
            sha256=sha256,
            storage_path=str(storage_path),
            extracted_text=extracted_text,
        )
        self.db.add(record)
        await self.db.commit()
        await self.db.refresh(record)
        return record

    async def _extract_text(self, path: Path, content_type: str) -> str:
        if content_type == "text/plain":
            return await asyncio.to_thread(path.read_text, encoding="utf-8", errors="ignore")
        if content_type == "application/pdf":
            return await asyncio.to_thread(self._extract_pdf, path)
        if content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            return await asyncio.to_thread(self._extract_docx, path)
        return ""

    def _extract_pdf(self, path: Path) -> str:
        reader = PdfReader(str(path))
        parts: list[str] = []
        for page in reader.pages:
            parts.append(page.extract_text() or "")
        return "\n".join(parts).strip()

    def _extract_docx(self, path: Path) -> str:
        doc = Document(str(path))
        parts = [p.text for p in doc.paragraphs if p.text]
        return "\n".join(parts).strip()

