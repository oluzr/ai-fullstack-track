"""tools/gauge.py — 순수 이해도 게이지 로직. LLM 호출이 없어 스크립트도 불필요."""

from db.models import Concept
from tools.gauge import apply_result


def _make_concept(db_session, mastery_gauge=0):
    concept = Concept(term="테스트개념", definition="정의", mastery_gauge=mastery_gauge)
    db_session.add(concept)
    db_session.commit()
    db_session.refresh(concept)
    return concept


def test_correct_mc_answer_adds_25(db_session):
    concept = _make_concept(db_session)

    result = apply_result(db_session, concept.id, is_correct=True, score=None)

    assert result == {"new_gauge": 25, "mastery_ready": False}


def test_wrong_mc_answer_adds_nothing(db_session):
    concept = _make_concept(db_session)

    result = apply_result(db_session, concept.id, is_correct=False, score=None)

    assert result == {"new_gauge": 0, "mastery_ready": False}


def test_free_answer_high_score_adds_25(db_session):
    concept = _make_concept(db_session)

    result = apply_result(db_session, concept.id, is_correct=None, score=85)

    assert result == {"new_gauge": 25, "mastery_ready": False}


def test_free_answer_mid_score_adds_10(db_session):
    concept = _make_concept(db_session)

    result = apply_result(db_session, concept.id, is_correct=None, score=65)

    assert result == {"new_gauge": 10, "mastery_ready": False}


def test_free_answer_low_score_adds_nothing(db_session):
    concept = _make_concept(db_session)

    result = apply_result(db_session, concept.id, is_correct=None, score=30)

    assert result == {"new_gauge": 0, "mastery_ready": False}


def test_gauge_caps_at_100_and_marks_mastery_ready(db_session):
    concept = _make_concept(db_session, mastery_gauge=90)

    result = apply_result(db_session, concept.id, is_correct=True, score=None)

    assert result == {"new_gauge": 100, "mastery_ready": True}
