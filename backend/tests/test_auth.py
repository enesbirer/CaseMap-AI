import pytest


@pytest.mark.asyncio
async def test_register_login_me(client):
    r = await client.post("/api/v1/auth/register", json={"email": "u1@example.com", "password": "StrongPass123!"})
    assert r.status_code == 200
    token = r.json()["access_token"]

    r = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    me = r.json()
    assert me["email"] == "u1@example.com"

    r = await client.post("/api/v1/auth/login", json={"email": "u1@example.com", "password": "StrongPass123!"})
    assert r.status_code == 200
    assert "access_token" in r.json()

