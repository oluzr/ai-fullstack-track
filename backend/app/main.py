from fastapi import FastAPI

from app.routers import chat, concepts, notes
from db.base import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Fullstack Track Backend")

app.include_router(concepts.router)
app.include_router(notes.router)
app.include_router(chat.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
