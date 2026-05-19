from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel


class FileUploadResponse(BaseModel):
    file_id: uuid.UUID
    filename: str
    content_type: str
    size_bytes: int
    created_at: datetime

