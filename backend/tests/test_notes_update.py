"""PATCH /notes/{id} — 본문 수정 시 백링크가 다시 추출되는지 검증. 실제 LLM 호출 없음.

멘션 추출(extract_mentions)은 LLM을 부르므로 라우터가 쓰는 함수를 가짜로 바꿔 끼운다.
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.routers import notes
from db.base import Base, get_db
from db.models import Concept, Note, NoteLink


@pytest.fixture()
def setup(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)

    def override_get_db():
        db = TestSession()
        try:
            yield db
        finally:
            db.close()

    extract_calls: list[str] = []

    def fake_extract_mentions(db, note):
        # "롤백"이 본문에 있으면 롤백 개념을 언급한 것으로 친다.
        extract_calls.append(note.body)
        rollback = db.query(Concept).filter(Concept.term == "롤백").one()
        if "롤백" in note.body:
            db.add(NoteLink(note_id=note.id, mentioned_concept_id=rollback.id))
            db.commit()
            return [rollback.id]
        return []

    monkeypatch.setattr(notes, "extract_mentions", fake_extract_mentions)

    app = FastAPI()
    app.include_router(notes.router)
    app.dependency_overrides[get_db] = override_get_db

    with TestSession() as db:
        a = Concept(term="트랜잭션", definition="작업 묶음")
        b = Concept(term="롤백", definition="되돌리기")
        db.add_all([a, b])
        db.flush()
        note = Note(concept_id=a.id, body="실패하면 롤백한다")
        db.add(note)
        db.flush()
        db.add(NoteLink(note_id=note.id, mentioned_concept_id=b.id))
        db.commit()
        ids = {"note": note.id, "rollback": b.id}

    return TestClient(app), TestSession, extract_calls, ids


def test_update_replaces_body_and_reextracts_backlinks(setup):
    client, TestSession, extract_calls, ids = setup

    res = client.patch(f"/notes/{ids['note']}", json={"body": "  여러 작업을 한 번에 커밋한다  "})

    assert res.status_code == 200
    assert res.json()["body"] == "여러 작업을 한 번에 커밋한다"
    assert res.json()["concept_term"] == "트랜잭션"
    assert extract_calls == ["여러 작업을 한 번에 커밋한다"]
    # 롤백 언급이 사라졌으니 롤백 개념의 "언급됨" 목록에서도 빠져야 한다.
    assert client.get(f"/concepts/{ids['rollback']}/notes").json() == []
    with TestSession() as db:
        assert db.query(NoteLink).count() == 0


def test_update_with_same_body_skips_extraction(setup):
    client, TestSession, extract_calls, ids = setup

    res = client.patch(f"/notes/{ids['note']}", json={"body": "실패하면 롤백한다"})

    assert res.status_code == 200
    assert extract_calls == []
    with TestSession() as db:
        assert db.query(NoteLink).count() == 1


def test_update_with_empty_body_is_422(setup):
    client, _, extract_calls, ids = setup

    assert client.patch(f"/notes/{ids['note']}", json={"body": "   "}).status_code == 422
    assert extract_calls == []


def test_update_missing_note_is_404(setup):
    client, *_ = setup

    assert client.patch("/notes/999", json={"body": "새 본문"}).status_code == 404
