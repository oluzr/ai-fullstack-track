import json
import os

import litellm
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("MODEL", "gemini/gemini-3.6-flash")

# 최신 Gemini flash 모델은 간단한 작업에도 내부적으로 "thinking" 토큰을 상당히
# 소모한다(예: {"a":1} 출력에도 200토큰 이상). reasoning_effort를 낮춰 불필요한
# thinking 토큰을 줄인다 - 실제 테스트로 품질 저하 없이 출력 토큰이 크게 줄어드는 것 확인.
REASONING_EFFORT = os.getenv("REASONING_EFFORT", "low")


def complete(messages: list[dict], tools: list[dict] | None = None):
    """LiteLLM 래퍼. 프로바이더 SDK를 직접 호출하지 않고 litellm.completion()만 사용한다."""
    return litellm.completion(
        model=MODEL,
        messages=messages,
        tools=tools,
        reasoning_effort=REASONING_EFFORT,
    )


def complete_json(messages: list[dict]) -> dict:
    """응답을 JSON 객체로 강제하는 LiteLLM 호출. 파싱 실패 시 한 번 재시도한다."""
    for attempt in range(2):
        response = litellm.completion(
            model=MODEL,
            messages=messages,
            response_format={"type": "json_object"},
            reasoning_effort=REASONING_EFFORT,
        )
        content = response.choices[0].message.content or ""
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            if attempt == 0:
                messages = messages + [
                    {
                        "role": "user",
                        "content": "응답이 올바른 JSON이 아니었습니다. 다른 텍스트 없이 JSON 객체만 다시 출력하세요.",
                    }
                ]
                continue
            raise
