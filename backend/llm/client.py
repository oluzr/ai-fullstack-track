import os

import litellm
from dotenv import load_dotenv

load_dotenv()

MODEL = os.getenv("MODEL", "gemini/gemini-2.5-flash")


def complete(messages: list[dict], tools: list[dict] | None = None):
    """LiteLLM 래퍼. 프로바이더 SDK를 직접 호출하지 않고 litellm.completion()만 사용한다."""
    return litellm.completion(
        model=MODEL,
        messages=messages,
        tools=tools,
    )
