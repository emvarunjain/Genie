from sqlalchemy import Column, Integer, Text, Boolean, DateTime, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class UserQuestion(Base):
    __tablename__ = "user_questions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question = Column(Text, nullable=False)
    answer = Column(Text)
    agent_used = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    success = Column(Boolean, default=True)

    user = relationship("User", back_populates="questions")