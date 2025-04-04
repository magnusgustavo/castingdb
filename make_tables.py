from database import engine, Base

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

import asyncio
asyncio.run(create_tables())
