"""채팅 에이전트가 사용자의 개념 사전에 단어를 등록하는 도구."""

from db.base import SessionLocal
from db.models import Concept


def add_concept(term: str, definition: str) -> dict:
    """POST /concepts와 같은 규칙(같은 term 중복 불가)으로 개념을 등록한다.

    에이전트 루프는 도구에 DB 세션을 넘겨주지 않으므로 여기서 직접 연다.
    중복은 예외 대신 결과로 돌려줘서, LLM이 사용자에게 "이미 있다"고
    설명할 수 있게 한다.
    """
    term = term.strip()
    definition = definition.strip()
    if not term or not definition:
        return {"status": "invalid", "message": "term과 definition은 비어 있을 수 없습니다."}

    with SessionLocal() as db:
        existing = db.query(Concept).filter(Concept.term == term).first()
        if existing:
            return {
                "status": "exists",
                "id": existing.id,
                "term": existing.term,
                "definition": existing.definition,
            }

        concept = Concept(term=term, definition=definition)
        db.add(concept)
        db.commit()
        db.refresh(concept)
        return {
            "status": "created",
            "id": concept.id,
            "term": concept.term,
            "definition": concept.definition,
        }
