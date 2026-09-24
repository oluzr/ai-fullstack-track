"""agent/loop.py — tool-calling 루프의 종료 조건 검증. 실제 LLM 호출 없음."""

from agent.loop import run_agent
from tests.conftest import fake_response, fake_tool_call


def test_returns_final_answer_when_no_tool_calls(scripted_llm):
    scripted_llm.script = [fake_response(content="안녕하세요")]

    result = run_agent("안녕")

    assert result == "안녕하세요"
    assert len(scripted_llm.calls) == 1


def test_executes_tool_then_returns_final_answer(scripted_llm):
    call = fake_tool_call("echo", '{"text": "hi"}')
    scripted_llm.script = [
        fake_response(tool_calls=[call]),
        fake_response(content="다 됐습니다"),
    ]

    result = run_agent("echo 해줘")

    assert result == "다 됐습니다"
    assert len(scripted_llm.calls) == 2
    second_call_messages = scripted_llm.calls[1]["messages"]
    assert second_call_messages[-1]["role"] == "tool"
    assert second_call_messages[-1]["content"] == "hi"


def test_stops_after_max_iterations(scripted_llm):
    call = fake_tool_call("echo", '{"text": "loop"}')
    scripted_llm.script = [fake_response(tool_calls=[call]) for _ in range(5)]

    result = run_agent("무한 반복")

    assert result == "최대 반복 횟수에 도달했습니다."
    assert len(scripted_llm.calls) == 5
