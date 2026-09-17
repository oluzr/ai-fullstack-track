"""에이전트 루프.

모델이 tool_calls를 반환하면 도구를 실행하고 결과를 메시지에 붙여 다시
호출하는 구조. 무한 루프를 막기 위해 최대 반복 횟수를 둔다.
"""

import json

from llm.client import complete
from tools.schemas import TOOLS, DISPATCH

MAX_ITERATIONS = 5


def run_agent(user_message: str) -> str:
    messages: list[dict] = [{"role": "user", "content": user_message}]

    for _ in range(MAX_ITERATIONS):
        response = complete(messages=messages, tools=TOOLS)
        choice = response.choices[0].message
        tool_calls = choice.tool_calls

        if not tool_calls:
            return choice.content or ""

        messages.append(choice.model_dump())

        for call in tool_calls:
            tool_fn = DISPATCH[call.function.name]
            tool_args = json.loads(call.function.arguments or "{}")
            result = tool_fn(**tool_args)
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": call.id,
                    "content": str(result),
                }
            )

    return "최대 반복 횟수에 도달했습니다."
