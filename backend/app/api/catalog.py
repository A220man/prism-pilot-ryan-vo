from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.services.catalog import CatalogService
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    SkillListResponse,
    SkillImportRequest,
    SkillImportResponse,
)

router = APIRouter(prefix="/catalog", tags=["catalog"])


def get_catalog_service(session: AsyncSession = Depends(get_session)) -> CatalogService:
    return CatalogService(session)


@router.get("/skills", response_model=SkillListResponse)
async def list_skills(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    subcategory: Optional[str] = Query(None, description="Filter by subcategory"),
    search: Optional[str] = Query(None, description="Search in name, display_name, description, tags"),
    service: CatalogService = Depends(get_catalog_service),
):
    skills, total = await service.list_skills(
        page=page,
        page_size=page_size,
        category=category,
        subcategory=subcategory,
        search=search,
    )

    total_pages = (total + page_size - 1) // page_size if total > 0 else 0

    return SkillListResponse(
        items=[skill.to_dict() for skill in skills],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/skills/{skill_id}", response_model=SkillResponse)
async def get_skill(
    skill_id: int,
    service: CatalogService = Depends(get_catalog_service),
):
    skill = await service.get_skill(skill_id)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill.to_dict()


@router.get("/skills/name/{name}", response_model=SkillResponse)
async def get_skill_by_name(
    name: str,
    service: CatalogService = Depends(get_catalog_service),
):
    skill = await service.get_skill_by_name(name)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill.to_dict()


@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_data: SkillCreate,
    service: CatalogService = Depends(get_catalog_service),
):
    existing = await service.get_skill_by_name(skill_data.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Skill with name '{skill_data.name}' already exists",
        )
    skill = await service.create_skill(skill_data)
    return skill.to_dict()


@router.patch("/skills/{skill_id}", response_model=SkillResponse)
async def update_skill(
    skill_id: int,
    skill_data: SkillUpdate,
    service: CatalogService = Depends(get_catalog_service),
):
    skill = await service.update_skill(skill_id, skill_data)
    if not skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")
    return skill.to_dict()


@router.delete("/skills/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_id: int,
    service: CatalogService = Depends(get_catalog_service),
):
    deleted = await service.delete_skill(skill_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found")


@router.post("/import", response_model=SkillImportResponse)
async def import_skills(
    import_request: SkillImportRequest,
    service: CatalogService = Depends(get_catalog_service),
):
    imported, skipped, errors = await service.import_skills(import_request.skills)
    return SkillImportResponse(imported=imported, skipped=skipped, errors=errors)


@router.get("/categories", response_model=List[str])
async def get_categories(
    service: CatalogService = Depends(get_catalog_service),
):
    return await service.get_categories()


@router.get("/subcategories", response_model=List[str])
async def get_subcategories(
    category: Optional[str] = Query(None, description="Filter subcategories by category"),
    service: CatalogService = Depends(get_catalog_service),
):
    return await service.get_subcategories(category)
