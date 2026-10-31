import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.core.database import init_db, engine, async_session_maker
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
async def test_list_skills_empty(client):
    response = await client.get("/api/v1/catalog/skills")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["page_size"] == 20
    assert data["total_pages"] == 0


@pytest.mark.asyncio
async def test_create_skill(client):
    skill_data = {
        "name": "test-skill",
        "display_name": "Test Skill",
        "description": "A test skill for unit testing",
        "category": "testing",
        "subcategory": "unit",
        "tags": ["test", "unit"],
        "version": "1.0.0",
        "author": "Test Author",
        "source_url": "https://example.com/test-skill",
        "license": "MIT",
    }
    response = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "test-skill"
    assert data["display_name"] == "Test Skill"
    assert data["category"] == "testing"
    assert data["subcategory"] == "unit"
    assert data["tags"] == ["test", "unit"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_get_skill(client):
    skill_data = {
        "name": "get-test-skill",
        "display_name": "Get Test Skill",
        "description": "A skill to test GET endpoint",
        "category": "testing",
    }
    create_response = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert create_response.status_code == 201
    skill_id = create_response.json()["id"]

    response = await client.get(f"/api/v1/catalog/skills/{skill_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == skill_id
    assert data["name"] == "get-test-skill"
    assert data["display_name"] == "Get Test Skill"


@pytest.mark.asyncio
async def test_get_skill_not_found(client):
    response = await client.get("/api/v1/catalog/skills/999999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_skill_by_name(client):
    skill_data = {
        "name": "by-name-skill",
        "display_name": "By Name Skill",
        "description": "A skill to test GET by name",
        "category": "testing",
    }
    create_response = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert create_response.status_code == 201

    response = await client.get("/api/v1/catalog/skills/name/by-name-skill")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "by-name-skill"
    assert data["display_name"] == "By Name Skill"


@pytest.mark.asyncio
async def test_update_skill(client):
    skill_data = {
        "name": "update-test-skill",
        "display_name": "Update Test Skill",
        "description": "A skill to test PATCH endpoint",
        "category": "testing",
    }
    create_response = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert create_response.status_code == 201
    skill_id = create_response.json()["id"]

    update_data = {
        "display_name": "Updated Display Name",
        "description": "Updated description",
        "tags": ["updated", "patched"],
    }
    response = await client.patch(f"/api/v1/catalog/skills/{skill_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["display_name"] == "Updated Display Name"
    assert data["description"] == "Updated description"
    assert data["tags"] == ["updated", "patched"]


@pytest.mark.asyncio
async def test_delete_skill(client):
    skill_data = {
        "name": "delete-test-skill",
        "display_name": "Delete Test Skill",
        "description": "A skill to test DELETE endpoint",
        "category": "testing",
    }
    create_response = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert create_response.status_code == 201
    skill_id = create_response.json()["id"]

    response = await client.delete(f"/api/v1/catalog/skills/{skill_id}")
    assert response.status_code == 204

    get_response = await client.get(f"/api/v1/catalog/skills/{skill_id}")
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_duplicate_skill_rejected(client):
    skill_data = {
        "name": "duplicate-skill",
        "display_name": "Duplicate Skill",
        "description": "Testing duplicate rejection",
        "category": "testing",
    }
    response1 = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert response1.status_code == 201

    response2 = await client.post("/api/v1/catalog/skills", json=skill_data)
    assert response2.status_code == 409


@pytest.mark.asyncio
async def test_list_skills_with_pagination(client):
    for i in range(5):
        skill_data = {
            "name": f"page-skill-{i}",
            "display_name": f"Page Skill {i}",
            "description": f"Skill {i} for pagination test",
            "category": "testing",
        }
        await client.post("/api/v1/catalog/skills", json=skill_data)

    response = await client.get("/api/v1/catalog/skills?page=1&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert data["total"] == 5
    assert data["total_pages"] == 3

    response = await client.get("/api/v1/catalog/skills?page=2&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["page"] == 2


@pytest.mark.asyncio
async def test_list_skills_with_category_filter(client):
    await client.post("/api/v1/catalog/skills", json={
        "name": "cat-skill-1", "display_name": "Cat Skill 1", "description": "Desc", "category": "ml"
    })
    await client.post("/api/v1/catalog/skills", json={
        "name": "cat-skill-2", "display_name": "Cat Skill 2", "description": "Desc", "category": "ml"
    })
    await client.post("/api/v1/catalog/skills", json={
        "name": "cat-skill-3", "display_name": "Cat Skill 3", "description": "Desc", "category": "nlp"
    })

    response = await client.get("/api/v1/catalog/skills?category=ml")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert all(item["category"] == "ml" for item in data["items"])


@pytest.mark.asyncio
async def test_list_skills_with_search(client):
    await client.post("/api/v1/catalog/skills", json={
        "name": "search-ml-training", "display_name": "ML Training", "description": "Train ML models", "category": "ml"
    })
    await client.post("/api/v1/catalog/skills", json={
        "name": "search-nlp-inference", "display_name": "NLP Inference", "description": "Run NLP inference", "category": "nlp"
    })

    response = await client.get("/api/v1/catalog/skills?search=training")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "search-ml-training"


@pytest.mark.asyncio
async def test_import_skills(client):
    import_data = {
        "skills": [
            {
                "name": "import-skill-1",
                "display_name": "Import Skill 1",
                "description": "First imported skill",
                "category": "import-test",
            },
            {
                "name": "import-skill-2",
                "display_name": "Import Skill 2",
                "description": "Second imported skill",
                "category": "import-test",
            },
        ]
    }
    response = await client.post("/api/v1/catalog/import", json=import_data)
    assert response.status_code == 200
    data = response.json()
    assert data["imported"] == 2
    assert data["skipped"] == 0
    assert data["errors"] == []


@pytest.mark.asyncio
async def test_import_skills_skips_existing(client):
    await client.post("/api/v1/catalog/skills", json={
        "name": "existing-import-skill",
        "display_name": "Existing Import Skill",
        "description": "Already exists",
        "category": "import-test",
    })

    import_data = {
        "skills": [
            {
                "name": "existing-import-skill",
                "display_name": "Existing Import Skill",
                "description": "Already exists",
                "category": "import-test",
            },
            {
                "name": "new-import-skill",
                "display_name": "New Import Skill",
                "description": "New skill",
                "category": "import-test",
            },
        ]
    }
    response = await client.post("/api/v1/catalog/import", json=import_data)
    assert response.status_code == 200
    data = response.json()
    assert data["imported"] == 1
    assert data["skipped"] == 1
    assert len(data["errors"]) == 1


@pytest.mark.asyncio
async def test_get_categories(client):
    await client.post("/api/v1/catalog/skills", json={
        "name": "cat1-skill", "display_name": "Cat1 Skill", "description": "Desc", "category": "ml"
    })
    await client.post("/api/v1/catalog/skills", json={
        "name": "cat2-skill", "display_name": "Cat2 Skill", "description": "Desc", "category": "nlp"
    })

    response = await client.get("/api/v1/catalog/categories")
    assert response.status_code == 200
    data = response.json()
    assert "ml" in data
    assert "nlp" in data


@pytest.mark.asyncio
async def test_get_subcategories(client):
    await client.post("/api/v1/catalog/skills", json={
        "name": "sub1-skill", "display_name": "Sub1 Skill", "description": "Desc", "category": "ml", "subcategory": "training"
    })
    await client.post("/api/v1/catalog/skills", json={
        "name": "sub2-skill", "display_name": "Sub2 Skill", "description": "Desc", "category": "ml", "subcategory": "inference"
    })

    response = await client.get("/api/v1/catalog/subcategories?category=ml")
    assert response.status_code == 200
    data = response.json()
    assert "training" in data
    assert "inference" in data
