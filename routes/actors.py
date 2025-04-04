from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from sqlalchemy import select, asc

from models import Actor, ActorResponse, ActorCreate, ActorUpdate, Image
from database import get_db

router = APIRouter()

@router.get("/actors", response_model=List[ActorResponse])
async def get_actors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Actor).order_by(Actor.id))
    actors = result.scalars().all()
    return actors

@router.get("/actors/{actor_id}")
async def get_actor(actor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Actor).where(Actor.id == actor_id))
    actor = result.scalar()
    if not actor:
        raise HTTPException(status_code=404, detail="Actor not found")

    # Získání fotek
    result_images = await db.execute(select(Image).where(Image.actor_id == actor_id))
    images = result_images.scalars().all()
    image_data = [{"id": img.id, "file_url": img.file_url} for img in images]

    actor_dict = ActorResponse.model_validate(actor).model_dump()
    actor_dict["images"] = image_data
    return actor_dict


@router.post("/actors", response_model=ActorResponse, status_code=201)
async def create_actor(actor: ActorCreate, db: AsyncSession = Depends(get_db)):
    new_actor = Actor(**actor.dict())
    db.add(new_actor)
    await db.commit()
    await db.refresh(new_actor)
    return new_actor

@router.put("/actors/{actor_id}", response_model=ActorResponse)
async def update_actor(actor_id: int, actor_update: ActorUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Actor).where(Actor.id == actor_id))
    actor = result.scalar()
    if not actor:
        raise HTTPException(status_code=404, detail="Actor not found")
    for key, value in actor_update.dict(exclude_unset=True).items():
        setattr(actor, key, value)
    await db.commit()
    await db.refresh(actor)
    return actor

@router.delete("/actors/{actor_id}", status_code=204)
async def delete_actor(actor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Actor).where(Actor.id == actor_id))
    actor = result.scalar()
    if not actor:
        raise HTTPException(status_code=404, detail="Actor not found")
    await db.delete(actor)
    await db.commit()
