"""채팅 에이전트에 넘길 이전 대화를 토큰 예산 안에서 고른다.

컨텍스트 엔지니어링의 "최근 우선 + 잘라내기" 전략이다: 가장 최근 턴부터
거꾸로 담다가 예산을 넘는 순간 멈추고, 그보다 오래된 턴은 버린다. LLM
호출이 추가로 들지 않는 가장 싼 방법이라 첫 단계로 이것만 쓴다 — 대화가
길어져 앞 맥락을 잃는 게 문제가 되면 그때 오래된 턴 요약을 붙인다.

"이거 사전에 추가해줘"처럼 바로 앞 답변을 가리키는 요청은 최근 몇 턴만
있으면 충분하므로, 오래된 턴부터 버리는 쪽이 손해가 가장 적다.
"""

import litellm

from llm.client import MODEL

HISTORY_TOKEN_BUDGET = 3000


def count_tokens(messages: list[dict]) -> int:
    return litellm.token_counter(model=MODEL, messages=messages)


def recent_history(
    turns: list[tuple[str, str]], budget: int = HISTORY_TOKEN_BUDGET
) -> list[dict]:
    """(role, text) 목록(오래된 순)에서 예산 안에 드는 최근 턴만 오래된 순으로 돌려준다."""
    picked: list[dict] = []
    used = 0
    for role, text in reversed(turns):
        message = {"role": role, "content": text}
        cost = count_tokens([message])
        if used + cost > budget:
            break
        picked.append(message)
        used += cost
    picked.reverse()

    # 대화는 user로 시작해야 자연스럽다 — 예산 경계에서 assistant 답변만
    # 덩그러니 남으면 무엇에 대한 답인지 알 수 없는 잡음이 되니 뗀다.
    while picked and picked[0]["role"] != "user":
        picked.pop(0)
    return picked
