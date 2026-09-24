"""llm/client.py — JSON 강제 파싱, 재시도, FALLBACK_MODEL 전환 검증.

전부 litellm.completion을 스크립트로 갈아끼워서 돈다 — 실제 LLM 호출 없음.
"""

import json

import litellm
import pytest

from llm import client as llm_client
from tests.conftest import fake_response


def _service_unavailable():
    return litellm.exceptions.ServiceUnavailableError(
        message="일시적 과부하", llm_provider="test", model=llm_client.MODEL
    )


def test_complete_json_returns_parsed_dict(scripted_llm):
    scripted_llm.script = [fake_response(content=json.dumps({"a": 1}))]

    result = llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert result == {"a": 1}
    assert len(scripted_llm.calls) == 1


def test_complete_json_retries_once_on_invalid_json(scripted_llm):
    scripted_llm.script = [
        fake_response(content="이건 JSON이 아님"),
        fake_response(content=json.dumps({"ok": True})),
    ]

    result = llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert result == {"ok": True}
    assert len(scripted_llm.calls) == 2


def test_complete_json_raises_after_second_invalid_json(scripted_llm):
    scripted_llm.script = [
        fake_response(content="아니오"),
        fake_response(content="여전히 아니오"),
    ]

    with pytest.raises(json.JSONDecodeError):
        llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert len(scripted_llm.calls) == 2


def test_transient_error_is_retried_then_succeeds(scripted_llm):
    err = _service_unavailable()
    scripted_llm.script = [err, err, fake_response(content=json.dumps({"ok": True}))]

    result = llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert result == {"ok": True}
    assert len(scripted_llm.calls) == 3  # 최대 3회까지 재시도


def test_falls_back_to_fallback_model_after_retries_exhausted(scripted_llm, monkeypatch):
    monkeypatch.setattr(llm_client, "FALLBACK_MODEL", "fallback/model")
    err = _service_unavailable()
    scripted_llm.script = [err, err, err, fake_response(content=json.dumps({"ok": True}))]

    result = llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert result == {"ok": True}
    assert len(scripted_llm.calls) == 4  # MODEL 3회 + FALLBACK_MODEL 1회
    assert scripted_llm.calls[-1]["model"] == "fallback/model"


def test_raises_when_no_fallback_model_configured(scripted_llm, monkeypatch):
    monkeypatch.setattr(llm_client, "FALLBACK_MODEL", "")
    err = _service_unavailable()
    scripted_llm.script = [err, err, err]

    with pytest.raises(litellm.exceptions.ServiceUnavailableError):
        llm_client.complete_json([{"role": "user", "content": "hi"}])

    assert len(scripted_llm.calls) == 3
