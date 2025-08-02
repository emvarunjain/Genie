from sqlalchemy import Column, String, Integer, Boolean
from app.core.database import Base

class SystemConfig(Base):
    __tablename__ = "system_config"
    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True, index=True, nullable=False)
    value = Column(String, nullable=False) 