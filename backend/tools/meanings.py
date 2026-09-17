"""개념 등록 전, 단어의 의미(들)를 LLM으로 추론하는 도구.

동음이의어 가능성을 판단해 여러 의미 후보를 주거나, 단일 의미를 제시한다.
사용자가 "다시 추론"을 요청하면 exclude로 이미 본 의미를 넘겨 다른 의미를 유도한다.
"""

import json

from llm.client import complete_json


def infer_meanings(term: str, exclude: list[str] | None = None) -> dict:
    """returns: {"is_ambiguous": bool, "meanings": [str, ...]}"""
    exclude_note = ""
    if exclude:
        exclude_note = (
            "\n다음 의미들은 이미 제시했던 것이니 반복하지 말고 다른 의미나 관점을 제시하라: "
            + json.dumps(exclude, ensure_ascii=False)
        )

    messages = [
        {
            "role": "system",
            "content": (
                "너는 사용자가 사전에 등록하려는 단어의 의미를 정리해주는 도우미다. "
                "주어진 단어가 서로 확연히 다른 여러 의미(동음이의어)로 쓰일 수 있는지 판단하라. "
                '반드시 다음 JSON 형식으로만 응답하라: '
                '{"is_ambiguous": true 또는 false, "meanings": ["의미 설명", ...]}. '
                "동음이의어라고 판단되면 대표적인 의미를 2~3개, 아니라면 가장 널리 쓰이는 "
                "의미 하나만 meanings 배열에 담아라. 각 의미는 한두 문장으로 명확하게 설명하라."
            ),
        },
        {"role": "user", "content": f"단어: {term}{exclude_note}"},
    ]
    return complete_json(messages)
