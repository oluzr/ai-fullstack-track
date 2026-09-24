"""tools/code_review.py — LLM 리뷰 결과 파싱 검증. 실제 LLM 호출 없음."""

import json

from tests.conftest import fake_response
from tools.code_review import review_submission

PROBLEM = {
    "title": "두 수의 합",
    "prompt": "더해서 target이 되는 두 인덱스를 반환하세요.",
    "constraints": "2 ≤ len(numbers) ≤ 10000",
    "examples": [{"input": "numbers=[2,7,11,15], target=9", "output": "[0,1]"}],
}


def test_review_submission_returns_parsed_feedback(scripted_llm):
    scripted_llm.script = [
        fake_response(
            content=json.dumps(
                {
                    "passed": True,
                    "score": 88,
                    "feedback": {
                        "correctness": "로직이 정확합니다.",
                        "complexity": "O(n)으로 효율적입니다.",
                        "improvement": "짝을 못 찾았을 때의 반환을 명시하세요.",
                    },
                }
            )
        )
    ]

    result = review_submission(PROBLEM, "python", "def solution(numbers, target): ...")

    assert result["passed"] is True
    assert result["score"] == 88
    assert result["feedback"]["complexity"] == "O(n)으로 효율적입니다."
    assert len(scripted_llm.calls) == 1
