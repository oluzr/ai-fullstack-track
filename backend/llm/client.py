import json
import os
import time

import litellm
from dotenv import load_dotenv

load_dotenv()

# 폴백 모델이 reasoning_effort 등 일부 파라미터를 지원하지 않아도 에러 대신 무시하도록 한다.
litellm.drop_params = True

MODEL = os.getenv("MODEL", "gemini/gemini-3.6-flash")

# 기본 모델(MODEL)이 재시도까지 다 실패했을 때 넘어갈 모델. 비워두면 폴백 없이 바로 실패한다.
FALLBACK_MODEL = os.getenv("FALLBACK_MODEL", "")

# 최신 Gemini flash 모델은 간단한 작업에도 내부적으로 "thinking" 토큰을 상당히
# 소모한다(예: {"a":1} 출력에도 200토큰 이상). reasoning_effort를 낮춰 불필요한
# thinking 토큰을 줄인다 - 실제 테스트로 품질 저하 없이 출력 토큰이 크게 줄어드는 것 확인.
REASONING_EFFORT = os.getenv("REASONING_EFFORT", "low")

# Gemini가 "일시적으로 과부하"라며 503류 오류를 종종 던지는데, 몇 초 뒤 재시도하면
# 대부분 바로 성공한다. 이런 일시적 오류만 짧게 재시도하고, 인증/잘못된 요청 같은
# 재시도해도 똑같이 실패할 오류는 바로 올린다.
_RETRYABLE_ERRORS = (
    litellm.exceptions.ServiceUnavailableError,
    litellm.exceptions.RateLimitError,
    litellm.exceptions.Timeout,
    litellm.exceptions.InternalServerError,
    litellm.exceptions.APIConnectionError,
)


def _completion_with_retry(model: str, max_attempts: int = 3, base_delay: float = 1.5, **kwargs):
    for attempt in range(max_attempts):
        try:
            return litellm.completion(model=model, **kwargs)
        except _RETRYABLE_ERRORS:
            if attempt == max_attempts - 1:
                raise
            time.sleep(base_delay * (2**attempt))


def _completion_with_fallback(**kwargs):
    """MODEL로 재시도까지 다 실패하면 FALLBACK_MODEL(다른 프로바이더)로 한 번 더 시도한다."""
    try:
        return _completion_with_retry(MODEL, **kwargs)
    except _RETRYABLE_ERRORS:
        if not FALLBACK_MODEL:
            raise
        return _completion_with_retry(FALLBACK_MODEL, **kwargs)


def complete(messages: list[dict], tools: list[dict] | None = None):
    """LiteLLM 래퍼. 프로바이더 SDK를 직접 호출하지 않고 litellm.completion()만 사용한다."""
    return _completion_with_fallback(
        messages=messages,
        tools=tools,
        reasoning_effort=REASONING_EFFORT,
    )


def complete_json(messages: list[dict]) -> dict:
    """응답을 JSON 객체로 강제하는 LiteLLM 호출. 파싱 실패 시 한 번 재시도한다."""
    for attempt in range(2):
        response = _completion_with_fallback(
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
