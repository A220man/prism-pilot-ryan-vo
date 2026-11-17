from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill
from app.schemas.stack_validation import StackValidationRequest, StackValidationResult


class StackValidationService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def validate_stack(self, request: StackValidationRequest) -> StackValidationResult:
        errors: List[str] = []
        valid_skill_ids: List[int] = []
        invalid_skill_ids: List[int] = []

        for skill_id in request.skill_ids:
            result = await self.session.execute(select(Skill).where(Skill.id == skill_id))
            skill = result.scalar_one_or_none()
            if skill is None:
                errors.append(f"Skill with ID {skill_id} not found")
                invalid_skill_ids.append(skill_id)
            else:
                valid_skill_ids.append(skill_id)

        return StackValidationResult(
            valid=len(invalid_skill_ids) == 0,
            errors=errors,
            valid_skill_ids=valid_skill_ids,
            invalid_skill_ids=invalid_skill_ids,
        )
