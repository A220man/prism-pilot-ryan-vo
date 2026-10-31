from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class SkillBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    display_name: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=100)
    tags: List[str] = Field(default_factory=list)
    version: str = Field(default="1.0.0", max_length=50)
    author: Optional[str] = Field(None, max_length=255)
    source_url: Optional[str] = Field(None, max_length=500)
    license: Optional[str] = Field(None, max_length=100)


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    subcategory: Optional[str] = Field(None, max_length=100)
    tags: Optional[List[str]] = None
    version: Optional[str] = Field(None, max_length=50)
    author: Optional[str] = Field(None, max_length=255)
    source_url: Optional[str] = Field(None, max_length=500)
    license: Optional[str] = Field(None, max_length=100)


class SkillResponse(SkillBase):
    id: int
    created_at: str
    updated_at: str

    model_config = ConfigDict(from_attributes=True)


class SkillListResponse(BaseModel):
    items: List[SkillResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class SkillImportRequest(BaseModel):
    skills: List[SkillCreate] = Field(..., min_length=1)


class SkillImportResponse(BaseModel):
    imported: int
    skipped: int
    errors: List[str]
