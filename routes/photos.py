from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Path
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import Image
import os

router = APIRouter()

@router.post("/upload-photo")
async def upload_photo(actor_id: int = Form(...), file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    uploads_dir = "static/uploads"
    os.makedirs(uploads_dir, exist_ok=True)

    file_location = os.path.join(uploads_dir, file.filename)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    new_image = Image(actor_id=actor_id, file_url=f"/static/uploads/{file.filename}")
    db.add(new_image)
    await db.commit()
    await db.refresh(new_image)

    return JSONResponse(content={"message": "Fotka byla nahrána", "image_id": new_image.id})


@router.delete("/delete-photo/{photo_id}")
async def delete_photo(photo_id: int = Path(...), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Image).where(Image.id == photo_id))
    image = result.scalar()
    if not image:
        raise HTTPException(status_code=404, detail="Fotka nebyla nalezena")

    file_path = f".{image.file_url}"
    if os.path.exists(file_path):
        os.remove(file_path)

    await db.delete(image)
    await db.commit()
    return {"message": "Fotka byla smazána"}
