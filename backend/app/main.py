from fastapi import FastAPI
from pydantic import BaseModel

from agent.loop import run_agent
from app.routers import code, concepts, notes
from db.base import Base, SessionLocal, engine
from db.seed import seed_code_problems

Base.metadata.create_all(bind=engine)

with SessionLocal() as _db:
    seed_code_problems(_db)

app = FastAPI(title="AI Fullstack Track Backend")

app.include_router(concepts.router)
app.include_router(notes.router)
app.include_router(code.router)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    reply = run_agent(request.message)
    return ChatResponse(reply=reply)
