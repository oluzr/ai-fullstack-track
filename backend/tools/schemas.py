"""도구 스키마(TOOLS)와 이름→함수 디스패치 테이블(DISPATCH).

echo는 루프 동작 검증용 더미 도구, add_concept는 채팅에서 개념 사전에
단어를 등록하는 도구다.
"""

from tools.dictionary import add_concept


def echo(text: str) -> str:
    return text


TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "echo",
            "description": "입력받은 텍스트를 그대로 반환하는 더미 도구",
            "parameters": {
                "type": "object",
                "properties": {
                    "text": {
                        "type": "string",
                        "description": "그대로 돌려줄 텍스트",
                    }
                },
                "required": ["text"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "add_concept",
            "description": (
                "사용자의 개념 사전에 단어를 등록한다. 사용자가 '사전에 추가해줘', "
                "'등록해줘'처럼 명시적으로 요청했을 때만 호출한다. '이거', '그 단어'처럼 "
                "앞 대화를 가리키면 대화에서 설명한 단어와 그 설명을 근거로 채운다. "
                "결과 status가 exists면 이미 등록된 단어라고 사용자에게 알린다."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "term": {
                        "type": "string",
                        "description": "등록할 단어 (예: 트랜잭션)",
                    },
                    "definition": {
                        "type": "string",
                        "description": (
                            "앞서 대화에서 설명한 내용을 한두 문장으로 줄인 정의. "
                            "비유·예시는 빼고 핵심 의미만, 마크다운 없이 평문으로 쓴다."
                        ),
                    },
                },
                "required": ["term", "definition"],
            },
        },
    },
]

DISPATCH = {
    "echo": echo,
    "add_concept": add_concept,
}
