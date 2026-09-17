"""메모 본문에서 다른 등록된 개념 언급을 추출해 note_links에 기록하는 도구."""

import json

from sqlalchemy.orm import Session

from db.models import Concept, Note, NoteLink
from llm.client import complete_json


def extract_mentions(db: Session, note: Note) -> list[int]:
    """note.body에서 언급된 다른 concept들의 id를 찾아 note_links에 기록하고 반환한다."""
    concepts = db.query(Concept).filter(Concept.id != note.concept_id).all()
    if not concepts:
        return []

    concept_list = [
        {"id": c.id, "term": c.term, "definition": c.definition} for c in concepts
    ]

    messages = [
        {
            "role": "system",
            "content": (
                "다음은 사용자가 등록한 개념 목록이다(각 개념에는 사용자가 등록한 의미가 "
                "정의되어 있다). 주어진 메모 본문에서 이 개념들 중 실제로 언급되거나 명확히 "
                "암시된 것들의 id만 찾아라. 동음이의어일 수 있으니, 단순히 단어가 같다고 "
                "판단하지 말고 등록된 의미(definition)와 문맥이 맞는 경우에만 언급으로 인정하라. "
                '반드시 다음 JSON 형식으로만 응답하라: {"mentioned_ids": [id, ...]}. '
                "언급된 개념이 없으면 빈 배열을 반환하라. 목록에 없는 id를 만들어내지 마라."
            ),
        },
        {
            "role": "user",
            "content": (
                f"개념 목록: {json.dumps(concept_list, ensure_ascii=False)}\n\n"
                f"메모 본문: {note.body}"
            ),
        },
    ]
    result = complete_json(messages)
    raw_ids = result.get("mentioned_ids", [])

    valid_ids = {c.id for c in concepts}
    mentioned_ids = [mid for mid in raw_ids if mid in valid_ids]

    for mid in mentioned_ids:
        db.add(NoteLink(note_id=note.id, mentioned_concept_id=mid))
    if mentioned_ids:
        db.commit()

    return mentioned_ids
