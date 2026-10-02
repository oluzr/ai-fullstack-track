"""에이전트 루프.

모델이 tool_calls를 반환하면 도구를 실행하고 결과를 메시지에 붙여 다시
호출하는 구조. 무한 루프를 막기 위해 최대 반복 횟수를 둔다.

stream_agent()는 각 단계(추론 시작 / 도구 호출 / 도구 결과 / 최종 응답)를
이벤트로 yield한다 — 호출하는 쪽(HTTP 스트리밍)이 진행 상황을 실시간으로
클라이언트에 넘길 수 있게 하기 위해서다. run_agent()는 그 이벤트들을 다
소비해서 최종 텍스트만 돌려주는 기존 동기 인터페이스로, 내부적으로
stream_agent()를 감싼 것뿐이다.
"""

import json
from collections.abc import Iterator
from typing import Any

from llm.client import complete
from tools.schemas import DISPATCH, TOOLS

MAX_ITERATIONS = 5

SYSTEM_PROMPT = (
    "너는 사용자가 개념을 익히도록 돕는 학습 도우미다. 사용자는 모르는 단어를 "
    "'개념 사전'에 등록해 두고 퀴즈로 복습한다. 답변은 한국어로, 필요하면 마크다운을 "
    "써서 간결하게 한다. 사용자가 사전에 추가해 달라고 명시적으로 요청할 때만 "
    "add_concept 도구를 호출하고, 등록 결과를 짧게 알려준다."
)


def stream_agent(
    user_message: str, history: list[dict] | None = None
) -> Iterator[dict[str, Any]]:
    """history는 이번 메시지 이전의 대화({"role", "content"} 목록, 오래된 순)다.

    질문을 맨 끝에 두는 건 모델이 긴 컨텍스트의 끝을 더 잘 보기 때문이기도 하다.
    """
    messages: list[dict] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *(history or []),
        {"role": "user", "content": user_message},
    ]

    for _ in range(MAX_ITERATIONS):
        yield {"type": "thinking"}
        response = complete(messages=messages, tools=TOOLS)
        choice = response.choices[0].message
        tool_calls = choice.tool_calls

        if not tool_calls:
            yield {"type": "content", "text": choice.content or ""}
            return

        messages.append(choice.model_dump())

        for call in tool_calls:
            tool_args = json.loads(call.function.arguments or "{}")
            yield {"type": "tool_call", "name": call.function.name, "args": tool_args}

            tool_fn = DISPATCH[call.function.name]
            result = tool_fn(**tool_args)

            yield {"type": "tool_result", "name": call.function.name, "result": result}
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": result
                    if isinstance(result, str)
                    else json.dumps(result, ensure_ascii=False),
                }
            )

    yield {"type": "content", "text": "최대 반복 횟수에 도달했습니다."}


def run_agent(user_message: str) -> str:
    """기존 동기 인터페이스 — 스트림을 끝까지 소비해 최종 텍스트만 반환한다."""
    text = ""
    for event in stream_agent(user_message):
        if event["type"] == "content":
            text = event["text"]
    return text
