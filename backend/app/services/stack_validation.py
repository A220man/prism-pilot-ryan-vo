from typing import List, Set, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.skill import Skill
from app.schemas.stack_validation import (
    StackPlan,
    StackValidationRequest,
    StackValidationResult,
)


def _skill_tags(skill: Skill) -> Set[str]:
    """Extract tag set from a skill's comma-separated tags field."""
    return set(skill.tags.split(",")) if skill.tags else set()


def _check_tag_compatibility(
    skills: List[Skill],
) -> Tuple[bool, List[str]]:
    """Deterministic offline tag compatibility check.

    Returns (is_compatible, conflict_messages). Two skills are incompatible
    if they share no common tags and their tag sets are disjoint AND neither
    is empty. Skills with overlapping tags are considered compatible.
    """
    conflicts: List[str] = []
    for i, si in enumerate(skills):
        for sj in skills[i + 1 :]:
            tags_i = _skill_tags(si)
            tags_j = _skill_tags(sj)
            if tags_i and tags_j and tags_i.isdisjoint(tags_j):
                conflicts.append(
                    f"Skills {si.id} and {sj.id} have disjoint tag sets and may be incompatible"
                )
    return len(conflicts) == 0, conflicts


async def validate_stack_online(
    session: AsyncSession, request: StackValidationRequest,
) -> StackValidationResult:
    """Online validation: check existence + deterministic offline tag compatibility."""
    errors: List[str] = []
    valid_skill_ids: List[int] = []
    invalid_skill_ids: List[int] = []
    skills: List[Skill] = []

    for skill_id in request.skill_ids:
        result = await session.execute(select(Skill).where(Skill.id == skill_id))
        skill = result.scalar_one_or_none()
        if skill is None:
            errors.append(f"Skill with ID {skill_id} not found")
            invalid_skill_ids.append(skill_id)
        else:
            skills.append(skill)
            valid_skill_ids.append(skill_id)

    # Deterministic offline validation: tag compatibility
    _, tag_conflicts = _check_tag_compatibility(skills)
    errors.extend(tag_conflicts)

    return StackValidationResult(
        valid=len(invalid_skill_ids) == 0 and len(tag_conflicts) == 0,
        errors=errors,
        valid_skill_ids=valid_skill_ids,
        invalid_skill_ids=invalid_skill_ids,
    )


def export_plan(valid_skill_ids: List[int], invalid_skill_ids: List[int]) -> StackPlan:
    """Export a validation plan as a serializable model."""
    return StackPlan(
        valid=len(invalid_skill_ids) == 0 and len(valid_skill_ids) > 0,
        valid_skill_ids=valid_skill_ids,
        invalid_skill_ids=invalid_skill_ids,
    )


def import_plan(plan: StackPlan) -> StackValidationResult:
    """Import a previously exported validation plan into a validation result."""
    return StackValidationResult(
        valid=plan.valid,
        errors=[],
        valid_skill_ids=plan.valid_skill_ids,
        invalid_skill_ids=plan.invalid_skill_ids,
    )


class StackValidationService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def validate_stack(self, request: StackValidationRequest) -> StackValidationResult:
        return await validate_stack_online(self.session, request)
