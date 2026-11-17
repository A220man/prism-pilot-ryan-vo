from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.services.stack_validation import StackValidationService
from app.schemas.stack_validation import StackValidationRequest, StackValidationResult


router = APIRouter(prefix="/stack", tags=["stack"])


def get_stack_validation_service(session: AsyncSession = Depends(get_session)) -> StackValidationService:
    return StackValidationService(session)


@router.post("/validate", response_model=StackValidationResult)
async def validate_stack(
    request: StackValidationRequest,
    service: StackValidationService = Depends(get_stack_validation_service),
):
    result = await service.validate_stack(request)
    if not result.valid:
        # Return validation failure details; still returns result which includes errors
        pass
    return result
