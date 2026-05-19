from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.models.user import User, UserRole


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def create_user(self, email: str, password: str, role: UserRole = UserRole.user) -> User:
        existing = await self.get_by_email(email)
        if existing:
            raise ValueError("Bu e-posta zaten kayıtlı")
        user = User(email=email, password_hash=hash_password(password), role=role)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate(self, email: str, password: str) -> User:
        user = await self.get_by_email(email)
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("E-posta veya şifre hatalı")
        if not user.is_active:
            raise ValueError("Kullanıcı pasif")
        return user

