"""agent/context.py, tools/dictionary.py — 대화 기록 조립과 사전 등록 도구 검증. 실제 LLM 호출 없음."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from agent import context
from agent.context import recent_history
from db.base import Base
from db.models import Concept
from tools import dictionary


def test_keeps_all_turns_when_within_budget():
    turns = [("user", "트랜잭션이 뭐야?"), ("assistant", "여러 작업을 하나로 묶는 단위예요.")]

    assert recent_history(turns) == [
        {"role": "user", "content": "트랜잭션이 뭐야?"},
        {"role": "assistant", "content": "여러 작업을 하나로 묶는 단위예요."},
    ]


def test_drops_oldest_turns_first_when_over_budget(monkeypatch):
    # 토큰 수를 글자 수로 고정해 예산 경계를 예측 가능하게 만든다.
    monkeypatch.setattr(context, "count_tokens", lambda msgs: len(msgs[0]["content"]))
    turns = [
        ("user", "a" * 50),
        ("assistant", "b" * 50),
        ("user", "c" * 10),
        ("assistant", "d" * 10),
    ]

    assert [m["content"] for m in recent_history(turns, budget=30)] == ["c" * 10, "d" * 10]


def test_does_not_start_with_orphan_assistant_turn(monkeypatch):
    monkeypatch.setattr(context, "count_tokens", lambda msgs: len(msgs[0]["content"]))
    turns = [("user", "a" * 50), ("assistant", "b" * 10), ("user", "c" * 10)]

    assert recent_history(turns, budget=25) == [{"role": "user", "content": "c" * 10}]


@pytest.fixture()
def dictionary_db(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)
    monkeypatch.setattr(dictionary, "SessionLocal", TestSession)
    return TestSession


def test_add_concept_creates_then_reports_duplicate(dictionary_db):
    created = dictionary.add_concept(" 트랜잭션 ", "여러 DB 작업을 하나로 묶어 전부 성공하거나 전부 취소되게 하는 단위.")
    again = dictionary.add_concept("트랜잭션", "다른 정의")

    assert created["status"] == "created"
    assert created["term"] == "트랜잭션"
    assert again["status"] == "exists"
    assert again["id"] == created["id"]
    with dictionary_db() as db:
        assert db.query(Concept).count() == 1


def test_add_concept_rejects_empty_fields(dictionary_db):
    assert dictionary.add_concept("  ", "정의")["status"] == "invalid"
