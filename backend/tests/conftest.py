"""테스트 공용 픽스처.

CLAUDE.md 원칙: 퀴즈 생성/채점/멘션추출 등 실제 LLM 호출 엔드포인트를
검증한다는 이유로 자동으로 반복 호출하지 말 것. 여기 있는 것들은 그
제약 아래서 llm/client.py, agent/loop.py의 로직(재시도·폴백·루프 종료
조건)을 네트워크·API 키 없이 검증하기 위한 도구다.

litellm.completion을 ScriptedLLM으로 교체해, 정해준 응답(또는 예외)을
순서대로 돌려주게 한다. week06-agent-lab의 ScriptedLLM 패턴을 참고함.
"""

import time
from types import SimpleNamespace

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from db.base import Base


@pytest.fixture()
def db_session():
    """메모리 SQLite — 실제 app.db(개발용 파일)를 건드리지 않는다."""
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        yield session
    finally:
        session.close()


def fake_tool_call(name: str, arguments: str, call_id: str = "call_1"):
    return SimpleNamespace(
        id=call_id,
        function=SimpleNamespace(name=name, arguments=arguments),
        type="function",
    )


def fake_response(content: str | None = None, tool_calls: list | None = None):
    """litellm ModelResponse와 같은 모양의 최소 가짜 객체."""
    tool_calls = tool_calls or []

    def model_dump():
        return {
            "role": "assistant",
            "content": content,
            "tool_calls": [
                {
                    "id": c.id,
                    "type": "function",
                    "function": {
                        "name": c.function.name,
                        "arguments": c.function.arguments,
                    },
                }
                for c in tool_calls
            ]
            or None,
        }

    message = SimpleNamespace(
        content=content,
        tool_calls=tool_calls or None,
        role="assistant",
        model_dump=model_dump,
    )
    return SimpleNamespace(choices=[SimpleNamespace(message=message)])


class ScriptedLLM:
    """litellm.completion 대역. 정해준 응답/예외를 순서대로 내주고 호출을 기록한다."""

    def __init__(self):
        self.script: list = []
        self.calls: list[dict] = []

    def __call__(self, **kwargs):
        self.calls.append(kwargs)
        if not self.script:
            raise AssertionError("각본에 없는 추가 LLM 호출이 발생했다")
        item = self.script.pop(0)
        if isinstance(item, BaseException):
            raise item
        return item


@pytest.fixture()
def scripted_llm(monkeypatch):
    """litellm.completion을 ScriptedLLM으로 교체하고, 재시도 백오프 sleep도 끈다."""
    import litellm

    scripted = ScriptedLLM()
    monkeypatch.setattr(litellm, "completion", scripted)
    monkeypatch.setattr(time, "sleep", lambda _seconds: None)
    return scripted
