from __future__ import annotations

import asyncio
from functools import lru_cache
from pathlib import Path

@lru_cache(maxsize=1)
def _get_model():
    try:
        from faster_whisper import WhisperModel
    except Exception as exc:
        raise RuntimeError("Ses analizi için 'faster-whisper' kurulmalı") from exc
    return WhisperModel("base", device="cpu", compute_type="int8")


async def transcribe_audio(path: Path) -> str:
    model = _get_model()
    segments, _info = await asyncio.to_thread(model.transcribe, str(path))
    parts: list[str] = []
    for seg in segments:
        if seg.text:
            parts.append(seg.text.strip())
    return " ".join(parts).strip()
