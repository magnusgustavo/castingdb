from sqlalchemy import Column, Integer, String
from database import Base
from pydantic import BaseModel
from typing import Optional

# SQLAlchemy model pro tabulku actors
class Actor(Base):
    __tablename__ = "actors"

    id = Column(Integer, primary_key=True)
    ident_code = Column(String(50), unique=True)
    act_name = Column(String(100), nullable=False)
    act_surname = Column(String(100), nullable=False)
    birth_year = Column(Integer)
    gender = Column(String(50))
    height_cm = Column(Integer)
    weight_kg = Column(Integer)

    eyes_color = Column(String(50))
    hair_color = Column(String(50))
    skin_color = Column(String(50))
    email = Column(String(100))
    agency = Column(String(100))
    nationality = Column(String(50))
    family = Column(String(50))
    home_phone = Column(String(50))
    temp_address = Column(String(200))
    www = Column(String(200))

# SQLAlchemy model pro tabulku images
class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer)  # Volitelně můžeš dát ForeignKey("actors.id")
    file_url = Column(String, nullable=False)
    image_count = Column(String(20), nullable=True)
    video_count = Column(String(20), nullable=True)

# GET
class ActorResponse(BaseModel):
    id: int
    ident_code: str
    act_name: str
    act_surname: str
    birth_year: Optional[int]
    gender: Optional[str]
    height_cm: Optional[int]
    weight_kg: Optional[int]

    eyes_color: Optional[str]
    hair_color: Optional[str]
    skin_color: Optional[str]
    email: Optional[str]
    agency: Optional[str]
    nationality: Optional[str]
    family: Optional[str]
    home_phone: Optional[str]
    temp_address: Optional[str]
    www: Optional[str]

    class Config:
        from_attributes = True

# POST
class ActorCreate(BaseModel):
    ident_code: str
    act_name: str
    act_surname: str
    birth_year: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None

    eyes_color: Optional[str] = None
    hair_color: Optional[str] = None
    skin_color: Optional[str] = None
    email: Optional[str] = None
    agency: Optional[str] = None
    nationality: Optional[str] = None
    family: Optional[str] = None
    home_phone: Optional[str] = None
    temp_address: Optional[str] = None
    www: Optional[str] = None

# PUT/PATCH
class ActorUpdate(BaseModel):
    ident_code: Optional[str]
    act_name: Optional[str]
    act_surname: Optional[str]
    birth_year: Optional[int]
    gender: Optional[str]
    height_cm: Optional[int]
    weight_kg: Optional[int]

    eyes_color: Optional[str]
    hair_color: Optional[str]
    skin_color: Optional[str]
    email: Optional[str]
    agency: Optional[str]
    nationality: Optional[str]
    family: Optional[str]
    home_phone: Optional[str]
    temp_address: Optional[str]
    www: Optional[str]

class ImageResponse(BaseModel):
    id: int
    actor_id: int
    file_url: str
    image_count: Optional[str]
    video_count: Optional[str]

    class Config:
        from_attributes = True

class ImageCreate(BaseModel):
    actor_id: int
    file_url: str
    image_count: Optional[str] = None
    video_count: Optional[str] = None
