from __future__ import annotations

import json
import re
from typing import Any

import orjson


def json_dumps(obj: Any) -> str:
    return orjson.dumps(obj, option=orjson.OPT_NON_STR_KEYS).decode("utf-8")


_JSON_RE = re.compile(r"\{[\s\S]*\}")


def extract_json_object(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        return json.loads(text)
    match = _JSON_RE.search(text)
    if not match:
        raise ValueError("JSON bulunamadı")
    return json.loads(match.group(0))

