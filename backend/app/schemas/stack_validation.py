from typing import List
from pydantic import BaseModel, Field


class StackValidationRequest(BaseModel):
    """Request payload for validating a stack of skill IDs."""
    skill_ids: List[int] = Field(..., min_items=1, description="List of skill IDs to validate")


class StackValidationResult(BaseModel):
    """Result of deterministic offline validation algorithm."""
    valid: bool = Field(..., description="True if all skill IDs are valid")
    errors: List[str] = Field(default_factory=list, description="List of validation error messages")
    valid_skill_ids: List[int] = Field(default_factory=list, description="Skill IDs that passed validation")
    invalid_skill_ids: List[int] = Field(default_factory=list, description="Skill IDs that failed validation")
