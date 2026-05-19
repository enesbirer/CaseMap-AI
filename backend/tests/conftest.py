import os
import sys
from pathlib import Path

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import AsyncClient


PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test.db")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-123456")
os.environ.setdefault("LLM_PROVIDER_DEFAULT", "ollama")
os.environ.setdefault("ALLOW_PROVIDER_OVERRIDE", "true")


@pytest.fixture
def app():
    from app.main import create_app

    return create_app()


@pytest_asyncio.fixture
async def client(app):
    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac
