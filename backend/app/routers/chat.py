import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from agent.context import recent_history
from agent.loop import stream_agent
from app.schemas import ChatRequest, ChatSessionListOut, ChatSessionOut
from db.base import SessionLocal, get_db
from db.models import ChatMessage, ChatSession, utcnow

router = APIRouter()

TITLE_MAX_LEN = 40


def _make_title(message: str) -> str:
    lines = message.strip().splitlines()
    first_line = lines[0] if lines else "새 대화"
    if len(first_line) <= TITLE_MAX_LEN:
        return first_line
    return first_line[:TITLE_MAX_LEN].rstrip() + "…"


@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)) -> StreamingResponse:
    """NDJSON 스트림 — 줄마다 하나의 에이전트 이벤트(JSON)를 내려준다.

    이벤트 종류는 stream_agent() 참고: thinking / tool_call / tool_result / content.
    같은 대화의 이전 메시지는 토큰 예산 안에서 최근 것부터 골라 LLM에 함께 넘긴다
    (agent/context.py). 그 앞에 이번 대화의 id를 알려주는 session 이벤트가 한 번 먼저 나간다 —
    프론트는 이 id를 다음 메시지의 session_id로 넘겨서 같은 대화에 이어 붙인다.
    """
    if request.session_id is None:
        session = ChatSession(title=_make_title(request.message))
        db.add(session)
        history: list[dict] = []
    else:
        session = db.get(ChatSession, request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="chat session not found")
        session.updated_at = utcnow()
        # 이번 메시지를 저장하기 전에 읽어야 history에 질문이 중복으로 안 들어간다.
        history = recent_history([(m.role, m.text) for m in session.messages])

    db.flush()
    db.add(ChatMessage(session_id=session.id, role="user", text=request.message))
    db.commit()
    session_id = session.id

    def event_stream():
        yield json.dumps({"type": "session", "session_id": session_id}) + "\n"
        for event in stream_agent(request.message, history):
            # 스트림은 응답이 나간 뒤에도 계속 도는데, 그 시점엔 get_db 세션의
            # 수명을 보장할 수 없어서 답변 저장용 세션은 따로 연다.
            if event["type"] == "content":
                with SessionLocal() as write_db:
                    write_db.add(
                        ChatMessage(session_id=session_id, role="assistant", text=event["text"])
                    )
                    write_session = write_db.get(ChatSession, session_id)
                    write_session.updated_at = utcnow()
                    write_db.commit()
            yield json.dumps(event, ensure_ascii=False) + "\n"

    return StreamingResponse(event_stream(), media_type="application/x-ndjson")


@router.get("/chat/sessions", response_model=list[ChatSessionListOut])
def list_chat_sessions(db: Session = Depends(get_db)):
    rows = (
        db.query(ChatSession, func.count(ChatMessage.id))
        .outerjoin(ChatMessage, ChatMessage.session_id == ChatSession.id)
        .group_by(ChatSession.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )
    return [
        ChatSessionListOut(
            id=s.id,
            title=s.title,
            message_count=count,
            created_at=s.created_at,
            updated_at=s.updated_at,
        )
        for s, count in rows
    ]


@router.get("/chat/sessions/{session_id}", response_model=ChatSessionOut)
def get_chat_session(session_id: int, db: Session = Depends(get_db)):
    session = db.get(ChatSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="chat session not found")
    return session
