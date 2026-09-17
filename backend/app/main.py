from fastapi import FastAPI
from pydantic import BaseModel

from agent.loop import run_agent

app = FastAPI(title="AI Fullstack Track Backend")


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
