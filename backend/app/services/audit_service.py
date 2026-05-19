from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit_log import AuditLog


class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log(
        self,
        action: str,
        *,
        user_id=None,
        ip: str | None = None,
        user_agent: str | None = None,
        payload: dict[str, Any] | None = None,
    ) -> None:
        audit = AuditLog(action=action, user_id=user_id, ip=ip, user_agent=user_agent, payload=payload or {})
        self.db.add(audit)
        await self.db.commit()

