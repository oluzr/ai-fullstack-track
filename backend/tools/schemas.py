"""도구 스키마(TOOLS)와 이름→함수 디스패치 테이블(DISPATCH).

지금은 루프 동작 검증용 더미 도구(echo) 하나만 구현한다.
"""


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
    }
]

DISPATCH = {
    "echo": echo,
}
