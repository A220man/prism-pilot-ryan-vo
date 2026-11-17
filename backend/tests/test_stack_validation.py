import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.core.database import engine, async_session_maker
from app.models import Base


@pytest.fixture(scope="function", autouse=True)
async def setup_database():
    """Create tables before each test and drop after."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        yield client


@pytest.mark.asyncio
async def test_validate_stack_success(client):
    # Create three skills
    skill_data1 = {
        "name": "skill-one",
        "display_name": "Skill One",
        "description": "First skill",
        "category": "test",
        "tags": ["tag1"],
    }
    skill_data2 = {
        "name": "skill-two",
        "display_name": "Skill Two",
        "description": "Second skill",
        "category": "test",
        "tags": ["tag2"],
    }
    skill_data3 = {
        "name": "skill-three",
        "display_name": "Skill Three",
        "description": "Third skill",
        "category": "test",
        "tags": ["tag3"],
    }

    resp1 = await client.post("/api/v1/catalog/skills", json=skill_data1)
    assert resp1.status_code == 201
    skill_id1 = resp1.json()["id"]

    resp2 = await client.post("/api/v1/catalog/skills", json=skill_data2)
    assert resp2.status_code == 201
    skill_id2 = resp2.json()["id"]

    resp3 = await client.post("/api/v1/catalog/skills", json=skill_data3)
    assert resp3.status_code == 201
    skill_id3 = resp3.json()["id"]

    # Validate stack with valid IDs
    validation_payload = {"skill_ids": [skill_id1, skill_id2, skill_id3]}
    response = await client.post("/api/v1/stack/validate", json=validation_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is True
    assert len(data["errors"]) == 0
    assert set(data["valid_skill_ids"]) == {skill_id1, skill_id2, skill_id3}
    assert data["invalid_skill_ids"] == []


@pytest.mark.asyncio
async def test_validate_stack_missing(client):
    # No skills created initially
    validation_payload = {"skill_ids": [1, 999]}
    response = await client.post("/api/v1/stack/validate", json=validation_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert len(data["errors"]) == 2
    assert "Skill with ID 1 not found" in data["errors"]
    assert "Skill with ID 999 not found" in data["errors"]
    assert data["valid_skill_ids"] == []
    assert set(data["invalid_skill_ids"]) == {1, 999}
