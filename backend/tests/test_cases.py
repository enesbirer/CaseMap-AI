import pytest

from app.ai.schemas import AnalysisOutput
from app.ai.pipeline.analysis_engine import AnalysisEngine


@pytest.mark.asyncio
async def test_analyze_case_text(client, monkeypatch):
    async def fake_analyze(self, *, text, provider, model, retrieval_context):
        out = AnalysisOutput(
            legal_category="Kira Hukuku",
            actors=["Kiracı", "Ev Sahibi"],
            claim="Depozito İadesi",
            recommended_process=["Yazılı talep gönder", "Arabuluculuk başvurusu", "Dava aç"],
            risk_level="medium",
            extracted_entities={"para": "depozito"},
            timeline=[],
        )
        return out, "ollama", "llama3.1:8b"

    monkeypatch.setattr(AnalysisEngine, "analyze", fake_analyze)

    r = await client.post("/api/v1/auth/register", json={"email": "u2@example.com", "password": "StrongPass123!"})
    token = r.json()["access_token"]

    r = await client.post(
        "/api/v1/cases/analyze",
        headers={"Authorization": f"Bearer {token}"},
        json={"text": "Ev sahibim depozitomu geri vermiyor.", "retrieval": False},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["legal_category"] == "Kira Hukuku"
    assert data["risk_level"] == "medium"
    assert "case_id" in data

