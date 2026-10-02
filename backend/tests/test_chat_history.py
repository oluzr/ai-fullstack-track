"""app/routers/chat.py — 채팅 내역 저장/조회 검증. 실제 LLM 호출 없음.

app.main을 import하면 개발용 app.db에 create_all/시드가 돌기 때문에,
chat 라우터만 붙인 작은 앱을 만들고 DB는 메모리 SQLite로 바꿔 끼운다.
"""

import json

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.routers import chat
from db.base import Base, get_db
from tests.conftest import fake_response


@pytest.fixture()
def client(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)
    monkeypatch.setattr(chat, "SessionLocal", TestSession)

    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    app = FastAPI()
    app.include_router(chat.router)
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


def send(client: TestClient, message: str, session_id: int | None = None) -> list[dict]:
    res = client.post("/chat", json={"message": message, "session_id": session_id})
    assert res.status_code == 200
    return [json.loads(line) for line in res.text.splitlines() if line.strip()]


def test_first_message_creates_session_and_saves_both_turns(client, scripted_llm):
    scripted_llm.script = [fake_response(content="**안녕하세요**")]

    events = send(client, "안녕")

    assert events[0]["type"] == "session"
    session_id = events[0]["session_id"]

    detail = client.get(f"/chat/sessions/{session_id}").json()
    assert detail["title"] == "안녕"
    assert [(m["role"], m["text"]) for m in detail["messages"]] == [
        ("user", "안녕"),
        ("assistant", "**안녕하세요**"),
    ]


def test_follow_up_message_appends_to_same_session(client, scripted_llm):
    scripted_llm.script = [fake_response(content="첫 답"), fake_response(content="두 번째 답")]

    session_id = send(client, "첫 질문")[0]["session_id"]
    events = send(client, "두 번째 질문", session_id)

    assert events[0]["session_id"] == session_id
    sessions = client.get("/chat/sessions").json()
    assert len(sessions) == 1
    assert sessions[0]["message_count"] == 4


def test_unknown_session_id_is_404(client, scripted_llm):
    res = client.post("/chat", json={"message": "hi", "session_id": 999})

    assert res.status_code == 404
    assert scripted_llm.calls == []


def test_long_first_message_is_truncated_for_title(client, scripted_llm):
    scripted_llm.script = [fake_response(content="ok")]

    session_id = send(client, "가" * 60 + "\n둘째 줄")[0]["session_id"]

    title = client.get(f"/chat/sessions/{session_id}").json()["title"]
    assert title == "가" * 40 + "…"


def test_follow_up_message_sends_previous_turns_to_llm(client, scripted_llm):
    scripted_llm.script = [fake_response(content="여러 작업을 묶는 단위예요."), fake_response(content="등록했어요")]

    session_id = send(client, "트랜잭션이 뭐야?")[0]["session_id"]
    send(client, "이거 사전에 추가해줘", session_id)

    sent = scripted_llm.calls[1]["messages"]
    assert [(m["role"], m["content"]) for m in sent[1:]] == [
        ("user", "트랜잭션이 뭐야?"),
        ("assistant", "여러 작업을 묶는 단위예요."),
        ("user", "이거 사전에 추가해줘"),
    ]
    assert sent[0]["role"] == "system"


def test_delete_session_removes_it_and_its_messages(client, scripted_llm):
    scripted_llm.script = [fake_response(content="ok")]
    session_id = send(client, "안녕")[0]["session_id"]

    res = client.delete(f"/chat/sessions/{session_id}")

    assert res.status_code == 204
    assert client.get("/chat/sessions").json() == []
    assert client.get(f"/chat/sessions/{session_id}").status_code == 404
    assert client.delete(f"/chat/sessions/{session_id}").status_code == 404
