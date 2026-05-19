from __future__ import annotations

import re


_WS_RE = re.compile(r"\s+")


def normalize_text(text: str) -> str:
    text = text.strip()
    text = _WS_RE.sub(" ", text)
    return text


def safe_excerpt(text: str, max_len: int = 500) -> str:
    t = normalize_text(text)
    if len(t) <= max_len:
        return t
    return t[: max_len - 3] + "..."

