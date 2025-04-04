from pydantic import BaseModel
from typing import Optional

class ActorCreate(BaseModel):
    ident_code: str  
    act_name: str
    act_surname: str
    birth_year: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None

    class Config:
        from_attributes = True

class ActorUpdate(BaseModel):
    act_name: Optional[str] = None
    act_surname: Optional[str] = None
    birth_year: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None

    class Config:
        from_attributes = True

class ActorResponse(BaseModel):
    id: int
    ident_code: str
    act_name: str
    act_surname: str
    birth_year: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None

    class Config:
        from_attributes = True
