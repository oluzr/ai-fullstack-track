"""퀴즈 생성/채점 도구. LLM 호출은 모두 llm/client.py(LiteLLM)를 거치고,
결과는 구조화된 JSON으로 강제한다.
"""

import json

from sqlalchemy.orm import Session

from db.models import Concept, QuizAttempt
from llm.client import complete_json


def generate_mc_question(db: Session, concept_id: int) -> dict:
    """returns: {"question": str, "choices": [str, str, str], "correct_answer": str}"""
    concept = db.get(Concept, concept_id)

    past_attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.concept_id == concept_id, QuizAttempt.type == "mc")
        .all()
    )
    past_wrong_choices: set[str] = set()
    for attempt in past_attempts:
        if attempt.choices:
            for choice in attempt.choices:
                if choice != attempt.correct_answer:
                    past_wrong_choices.add(choice)

    avoid = ""
    if past_wrong_choices:
        avoid = (
            "\n이미 사용한 오답 보기(가능하면 반복하지 마세요): "
            f"{json.dumps(list(past_wrong_choices), ensure_ascii=False)}"
        )

    messages = [
        {
            "role": "system",
            "content": (
                "너는 개념 학습 퀴즈 출제자다. 주어진 개념에 대해 객관식 문제를 만든다. "
                "정의를 그대로 되묻는 문제(예: '~의 뜻은?')는 금지한다. 대신 구체적인 "
                "상황, 예시, 코드/시나리오에 그 개념을 적용해야 풀리는 응용형 문제를 내서, "
                "단순 암기가 아니라 제대로 이해했는지를 확인하라. "
                '반드시 다음 JSON 형식으로만 응답하라: '
                '{"question": "문제 본문", "choices": ["보기1", "보기2", "보기3"], '
                '"correct_answer": "정답 보기 원문(choices 중 하나와 완전히 동일한 문자열)"}. '
                "choices는 정확히 3개이며, 그 중 1개만 correct_answer와 동일한 정답이다. "
                "나머지 2개(오답)는 한눈에 틀린 티가 나는 보기이면 안 된다 — 비슷한 개념, "
                "흔히 하는 오해, 정답과 한두 단어만 다르거나 조건 하나만 바뀐 보기처럼 "
                "실제로 헷갈릴 만큼 그럴듯하게 만들어라. 사용자가 등록한 의미(정의)를 "
                "기준으로 출제하고, 다른 의미로 혼동되지 않게 하라."
            ),
        },
        {
            "role": "user",
            "content": f"개념: {concept.term}\n등록된 의미: {concept.definition}{avoid}",
        },
    ]
    return complete_json(messages)


def generate_free_prompt(db: Session, concept_id: int) -> str:
    concept = db.get(Concept, concept_id)
    return f'"{concept.term}"이(가) 무엇인지 자신의 말로 서술해보세요.'


def grade_free_answer(db: Session, concept_id: int, user_answer: str) -> dict:
    """returns: {"score": int (0-100), "feedback": str}"""
    concept = db.get(Concept, concept_id)

    messages = [
        {
            "role": "system",
            "content": (
                "너는 개념 이해도를 평가하는 채점자다. 사용자가 등록한 의미(정의)를 기준으로, "
                "사용자의 서술이 그 의미를 얼마나 정확하고 완전하게 설명했는지 0~100 사이 "
                "정수 점수로 채점한다. 등록된 의미와 다른 의미(동음이의어 등)로 답했다면 "
                "낮은 점수를 주고 피드백에 그 사실을 알려라. "
                '반드시 다음 JSON 형식으로만 응답하라: '
                '{"score": 0에서 100 사이의 정수, "feedback": "한 줄 피드백"}'
            ),
        },
        {
            "role": "user",
            "content": (
                f"개념: {concept.term}\n등록된 의미: {concept.definition}\n"
                f"사용자 답변: {user_answer}"
            ),
        },
    ]
    return complete_json(messages)
