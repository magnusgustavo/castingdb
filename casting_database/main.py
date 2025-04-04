import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from database import Base, engine, SessionLocal
from routes.actors import router as actors_router
from models import Image
from routes.photos import router as photos_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(photos_router)

app.include_router(actors_router)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "Casting Database API is running."}

@app.post("/upload-photo")
async def upload_photo(actor_id: int = Form(...), file: UploadFile = File(...)):
    uploads_dir = "static/uploads"
    os.makedirs(uploads_dir, exist_ok=True)

    file_location = os.path.join(uploads_dir, file.filename)
    with open(file_location, "wb") as buffer:
        buffer.write(await file.read())

    async with SessionLocal() as session:
        new_image = Image(
            actor_id=actor_id,
            file_url=f"/static/uploads/{file.filename}"
        )
        session.add(new_image)
        await session.commit()
        await session.refresh(new_image)

    return JSONResponse(content={"message": "Fotka byla úspěšně nahrána.", "image_id": new_image.id})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
