from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate


class CatalogService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_skills(
        self,
        page: int = 1,
        page_size: int = 20,
        category: Optional[str] = None,
        subcategory: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[Skill], int]:
        query = select(Skill)
        count_query = select(func.count(Skill.id))

        if category:
            query = query.where(Skill.category == category)
            count_query = count_query.where(Skill.category == category)

        if subcategory:
            query = query.where(Skill.subcategory == subcategory)
            count_query = count_query.where(Skill.subcategory == subcategory)

        if search:
            search_term = f"%{search.lower()}%"
            query = query.where(
                or_(
                    Skill.name.ilike(search_term),
                    Skill.display_name.ilike(search_term),
                    Skill.description.ilike(search_term),
                    Skill.tags.ilike(search_term),
                )
            )
            count_query = count_query.where(
                or_(
                    Skill.name.ilike(search_term),
                    Skill.display_name.ilike(search_term),
                    Skill.description.ilike(search_term),
                    Skill.tags.ilike(search_term),
                )
            )

        total = await self.session.scalar(count_query)
        total = total or 0

        query = query.order_by(Skill.category, Skill.name)
        query = query.offset((page - 1) * page_size).limit(page_size)

        result = await self.session.execute(query)
        skills = list(result.scalars().all())

        return skills, total

    async def get_skill(self, skill_id: int) -> Optional[Skill]:
        result = await self.session.execute(select(Skill).where(Skill.id == skill_id))
        return result.scalar_one_or_none()

    async def get_skill_by_name(self, name: str) -> Optional[Skill]:
        result = await self.session.execute(select(Skill).where(Skill.name == name))
        return result.scalar_one_or_none()

    async def create_skill(self, skill_data: SkillCreate) -> Skill:
        now = datetime.now(timezone.utc).isoformat()
        skill = Skill(
            name=skill_data.name,
            display_name=skill_data.display_name,
            description=skill_data.description,
            category=skill_data.category,
            subcategory=skill_data.subcategory,
            tags=",".join(skill_data.tags) if skill_data.tags else "",
            version=skill_data.version,
            author=skill_data.author,
            source_url=skill_data.source_url,
            license=skill_data.license,
            created_at=now,
            updated_at=now,
        )
        self.session.add(skill)
        await self.session.flush()
        await self.session.refresh(skill)
        return skill

    async def update_skill(self, skill_id: int, skill_data: SkillUpdate) -> Optional[Skill]:
        skill = await self.get_skill(skill_id)
        if not skill:
            return None

        update_data = skill_data.model_dump(exclude_unset=True)
        if "tags" in update_data and update_data["tags"] is not None:
            update_data["tags"] = ",".join(update_data["tags"])

        for field, value in update_data.items():
            setattr(skill, field, value)

        skill.updated_at = datetime.now(timezone.utc).isoformat()
        await self.session.flush()
        await self.session.refresh(skill)
        return skill

    async def delete_skill(self, skill_id: int) -> bool:
        skill = await self.get_skill(skill_id)
        if not skill:
            return False
        await self.session.delete(skill)
        await self.session.flush()
        return True

    async def import_skills(self, skills_data: List[SkillCreate]) -> Tuple[int, int, List[str]]:
        imported = 0
        skipped = 0
        errors = []

        for skill_data in skills_data:
            try:
                existing = await self.get_skill_by_name(skill_data.name)
                if existing:
                    skipped += 1
                    errors.append(f"Skill '{skill_data.name}' already exists, skipped")
                    continue

                await self.create_skill(skill_data)
                imported += 1
            except Exception as e:
                errors.append(f"Failed to import '{skill_data.name}': {str(e)}")

        return imported, skipped, errors

    async def get_categories(self) -> List[str]:
        result = await self.session.execute(
            select(Skill.category).distinct().order_by(Skill.category)
        )
        return list(result.scalars().all())

    async def get_subcategories(self, category: Optional[str] = None) -> List[str]:
        query = select(Skill.subcategory).distinct().where(Skill.subcategory.is_not(None))
        if category:
            query = query.where(Skill.category == category)
        query = query.order_by(Skill.subcategory)
        result = await self.session.execute(query)
        return list(result.scalars().all())
