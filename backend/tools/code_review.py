"""제출된 코드를 LLM이 읽고 평가하는 도구.

실제로 코드를 실행하지는 않는다 — LLM이 로직을 눈으로 읽고 판단하는
방식이라, "테스트케이스를 통과한다"는 실행 결과가 아니라 LLM의 판단임을
프롬프트에 명시해 과신하지 않게 한다.
"""

import json

from llm.client import complete_json


def review_submission(problem: dict, language: str, code: str) -> dict:
    """returns: {"passed": bool, "score": int,
    "feedback": {"correctness": str, "complexity": str, "improvement": str}}"""
    messages = [
        {
            "role": "system",
            "content": (
                "너는 코딩 테스트 채점자다. 문제와 제출된 코드를 읽고 평가한다. "
                "코드를 실제로 실행하는 것이 아니라 읽고 판단하는 것이므로, 단정적으로 "
                "'통과했다'고 말하기보다 로직을 검토한 결과임을 전제로 판단하라. "
                '반드시 다음 JSON 형식으로만 응답하라: '
                '{"passed": true 또는 false, "score": 0에서 100 사이의 정수, '
                '"feedback": {"correctness": "정확성 평가 한두 문장", '
                '"complexity": "시간/공간 복잡도 평가 한 문장", '
                '"improvement": "가장 중요한 보완점 한두 문장"}}. '
                "제약사항과 입출력 예를 기준으로 엣지 케이스(빈 입력, 경계값, 중복 등)를 "
                "놓치지 않았는지 확인하라."
            ),
        },
        {
            "role": "user",
            "content": (
                f"문제: {problem['title']}\n{problem['prompt']}\n"
                f"제약사항: {problem['constraints']}\n"
                f"입출력 예: {json.dumps(problem['examples'], ensure_ascii=False)}\n\n"
                f"제출 언어: {language}\n제출 코드:\n{code}"
            ),
        },
    ]
    return complete_json(messages)
