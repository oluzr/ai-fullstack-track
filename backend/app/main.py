from fastapi import FastAPI

from app.routers import chat, code, concepts, notes
from db.base import Base, SessionLocal, engine
from db.seed import seed_code_problems

Base.metadata.create_all(bind=engine)

with SessionLocal() as _db:
    seed_code_problems(_db)

app = FastAPI(title="AI Fullstack Track Backend")

app.include_router(concepts.router)
app.include_router(notes.router)
app.include_router(code.router)
app.include_router(chat.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
