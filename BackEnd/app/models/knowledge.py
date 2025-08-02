from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base
from enum import Enum as PyEnum

class IngestionStatus(str, PyEnum):
    PROCESSING = "processing"
    INGESTED = "ingested"
    FAILED = "failed"

class KnowledgeFile(Base):
    __tablename__ = "knowledge_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default=IngestionStatus.PROCESSING, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 