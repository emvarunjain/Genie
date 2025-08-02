from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class IngestionStatus(str, Enum):
    PROCESSING = "processing"
    INGESTED = "ingested"
    FAILED = "failed"

class KnowledgeFileBase(BaseModel):
    filename: str
    status: IngestionStatus

class KnowledgeFileCreate(KnowledgeFileBase):
    pass

class KnowledgeFile(KnowledgeFileBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class KnowledgeSource(BaseModel):
    source_type: str  # "url", "pdf", "text"
    source_data: str # URL or text content
    description: str 