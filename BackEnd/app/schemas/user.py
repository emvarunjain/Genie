from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    is_admin: Optional[bool] = False

class UserUpdate(UserBase):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class UserInDBBase(UserBase):
    id: int
    username: str
    is_active: bool
    is_admin: bool

    model_config = ConfigDict(from_attributes=True)

class User(UserInDBBase):
    created_at: datetime
    chat_requests_count: int

class UserUpdateAdmin(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None

class UserAdminDetailResponse(User):
    last_activity: Optional[datetime] = None
    total_requests: int = 0

class UserInDB(UserInDBBase):
    hashed_password: str

class UserLogin(BaseModel):
    username: str
    password: str 