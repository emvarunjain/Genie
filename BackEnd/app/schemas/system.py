from pydantic import BaseModel

class SystemConfigBase(BaseModel):
    key: str
    value: str

class SystemConfigUpdate(SystemConfigBase):
    pass

class SystemConfigResponse(SystemConfigBase):
    id: int

    class Config:
        orm_mode = True 