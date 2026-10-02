"""DELETE /notes/{id} — 메모와 백링크가 함께 지워지는지 검증. LLM 호출 없음.

메모 생성 API는 멘션 추출에 LLM을 부르므로, 데이터는 DB에 직접 넣는다.
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
def setup():
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

    app = FastAPI()
    app.include_router(notes.router)
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app), TestSession


def test_delete_note_removes_its_backlinks(setup):
    client, TestSession = setup
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
        note_id, b_id = note.id, b.id

    res = client.delete(f"/notes/{note_id}")

    assert res.status_code == 204
    assert client.get("/notes").json() == []
    assert client.get(f"/concepts/{b_id}/notes").json() == []
    with TestSession() as db:
        assert db.query(NoteLink).count() == 0
        assert db.query(Concept).count() == 2


def test_delete_missing_note_is_404(setup):
    client, _ = setup

    assert client.delete("/notes/999").status_code == 404
