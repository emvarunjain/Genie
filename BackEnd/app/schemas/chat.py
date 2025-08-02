from pydantic import BaseModel

class ChatRequest(BaseModel):
    """Chat request model"""
    message: str

class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    timestamp: str 