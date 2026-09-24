import json

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from agent.loop import stream_agent
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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat")
def chat(request: ChatRequest) -> StreamingResponse:
    """NDJSON 스트림 — 줄마다 하나의 에이전트 이벤트(JSON)를 내려준다.

    이벤트 종류는 stream_agent() 참고: thinking / tool_call / tool_result / content.
    프론트가 도구 호출·추론 진행 상황을 실시간으로 보여주려면 최종 응답을
    한 번에 받는 대신 이 줄 단위 이벤트를 순서대로 읽어야 한다.
    """

    def event_stream():
        for event in stream_agent(request.message):
            yield json.dumps(event, ensure_ascii=False) + "\n"

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")
