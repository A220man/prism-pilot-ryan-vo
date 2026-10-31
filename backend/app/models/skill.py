from sqlalchemy import Column, Integer, String, Text, Index
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    display_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True, index=True)
    tags = Column(String(500), nullable=True)  # comma-separated
    version = Column(String(50), nullable=False, default="1.0.0")
    author = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    license = Column(String(100), nullable=True)
    created_at = Column(String(50), nullable=False)  # ISO format
    updated_at = Column(String(50), nullable=False)  # ISO format

    # Composite indexes for common query patterns
    __table_args__ = (
        Index("ix_skills_category_subcategory", "category", "subcategory"),
        Index("ix_skills_name_category", "name", "category"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "display_name": self.display_name,
            "description": self.description,
            "category": self.category,
            "subcategory": self.subcategory,
            "tags": self.tags.split(",") if self.tags else [],
            "version": self.version,
            "author": self.author,
            "source_url": self.source_url,
            "license": self.license,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

