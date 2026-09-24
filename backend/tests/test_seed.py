"""db/seed.py — 순수 로직, LLM 호출 없음."""

from db.models import CodeProblem
from db.seed import SEED_PROBLEMS, seed_code_problems


def test_seed_inserts_problems_when_empty(db_session):
    seed_code_problems(db_session)

    assert db_session.query(CodeProblem).count() == len(SEED_PROBLEMS)


def test_seed_is_idempotent(db_session):
    seed_code_problems(db_session)
    seed_code_problems(db_session)

    assert db_session.query(CodeProblem).count() == len(SEED_PROBLEMS)
