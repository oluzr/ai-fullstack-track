from fastapi import FastAPI
from pydantic import BaseModel

from agent.loop import run_agent
from app.routers import concepts, notes
from db.base import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Fullstack Track Backend")

app.include_router(concepts.router)
app.include_router(notes.router)


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
