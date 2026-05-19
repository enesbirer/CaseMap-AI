from __future__ import annotations

import hashlib
import os
import re
from pathlib import Path


_FILENAME_SAFE_RE = re.compile(r"[^a-zA-Z0-9._-]+")


def sha256_bytes(data: bytes) -> str:
    h = hashlib.sha256()
    h.update(data)
    return h.hexdigest()


def sanitize_filename(filename: str) -> str:
    filename = os.path.basename(filename)
    filename = filename.strip().replace(" ", "_")
    filename = _FILENAME_SAFE_RE.sub("_", filename)
    return filename[:200] if len(filename) > 200 else filename


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def chunk_text(text: str, chunk_size: int = 900, overlap: int = 120) -> list[str]:
    text = text.strip()
    if not text:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start = max(0, end - overlap)
    return chunks

