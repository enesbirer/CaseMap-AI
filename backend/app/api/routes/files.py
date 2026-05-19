from __future__ import annotations

from fastapi import APIRouter, Depends, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.file import FileUploadResponse
from app.services.audit_service import AuditService
from app.services.file_service import FileService


router = APIRouter(prefix="/files", tags=["files"])


@router.post("/upload", response_model=FileUploadResponse)
async def upload_file(
    request: Request,
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FileUploadResponse:
    saved = await FileService(db).save_and_extract_text(current_user.id, file)
    await AuditService(db).log(
        "file.upload",
        user_id=current_user.id,
        ip=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
        payload={"file_id": str(saved.id), "filename": saved.filename, "content_type": saved.content_type},
    )
    return FileUploadResponse(
        file_id=saved.id,
        filename=saved.filename,
        content_type=saved.content_type,
        size_bytes=saved.size_bytes,
        created_at=saved.created_at,
    )

