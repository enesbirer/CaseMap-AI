from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

from fastapi import HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.core.logging import request_id_ctx_var


logger = logging.getLogger("app.error")


class ExceptionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            return await call_next(request)
        except HTTPException as exc:
            return self._json_error(exc.status_code, exc.detail, None)
        except ValueError as exc:
            return self._json_error(400, str(exc), None)
        except Exception as exc:
            logger.exception("unhandled_exception", extra={"path": request.url.path})
            return self._json_error(500, "Sunucu hatası", None)

    def _json_error(self, status_code: int, message: str, details: Any) -> JSONResponse:
        request_id = request_id_ctx_var.get()
        payload = {"error": {"message": message, "details": details, "request_id": request_id}}
        return JSONResponse(status_code=status_code, content=payload)

