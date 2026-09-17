"""이해도 게이지 갱신 규칙."""

from sqlalchemy.orm import Session

from db.models import Concept


def apply_result(
    db: Session, concept_id: int, is_correct: bool | None, score: int | None
) -> dict:
    """returns: {"new_gauge": int, "mastery_ready": bool}"""
    concept = db.get(Concept, concept_id)

    if is_correct is not None:
        delta = 25 if is_correct else 0
    elif score is not None and score >= 80:
        delta = 25
    elif score is not None and score >= 60:
        delta = 10
    else:
        delta = 0

    concept.mastery_gauge = min(100, concept.mastery_gauge + delta)
    db.commit()
    db.refresh(concept)

    return {
        "new_gauge": concept.mastery_gauge,
        "mastery_ready": concept.mastery_gauge >= 100,
    }
