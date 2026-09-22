"""등록된 개념을 더 쉽게 풀어서 설명해주는 도구.

사용자가 등록한 짧은 정의(온톨로지 사전에 넣을 만한 축약된 문장)를,
비유/예시를 곁들여 초보자도 감 잡을 수 있게 풀어 쓴다.
"""

from llm.client import complete_json


def explain_concept(term: str, definition: str) -> dict:
    """returns: {"explanation": str}"""
    messages = [
        {
            "role": "system",
            "content": (
                "너는 어려운 개념을 초보자도 이해하기 쉽게 풀어 설명하는 선생님이다. "
                "사용자는 이미 짧고 축약된 정의를 알고 있지만, 그것만으로는 감이 잘 안 와서 "
                "더 친절한 설명을 원한다. 일상적인 비유나 구체적인 예시를 최소 1개 포함해서, "
                "쉬운 말로 3~5문장 정도로 풀어 설명하라. 전문 용어를 쓸 땐 바로 옆에 "
                "간단히 뜻을 덧붙여라. "
                '반드시 다음 JSON 형식으로만 응답하라: {"explanation": "설명 전체 텍스트"}'
            ),
        },
        {
            "role": "user",
            "content": f"개념: {term}\n등록된 정의: {definition}",
        },
    ]
    return complete_json(messages)
