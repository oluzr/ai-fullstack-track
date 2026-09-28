import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FiSend } from 'react-icons/fi'
import { streamChat } from '../api'
import { flashAiPhase, useAiActivityStore } from '../store/useAiActivityStore'
import { ErrorText, Muted } from '../styles/shared'
import type { ChatActivityStep, ChatMessage, ChatStreamEvent } from '../types'
import ChatMessageBubble, { AVATAR_SRC } from './ChatMessageBubble'
import ThinkingDots from './ThinkingDots'
import {
  ActivityBubble,
  Avatar,
  ChatTextarea,
  CloseButton,
  EmptyAvatar,
  EmptyState,
  Header,
  InputBar,
  MessageList,
  Panel,
  Row,
  SendButton,
  StepDone,
  StepIcon,
  StepLabel,
  StepRow,
  Title,
} from './ChatPanel.styles'

// 도구 이름(백엔드 tools/schemas.py) → 진행 표시에 쓸 사람이 읽는 이름.
const TOOL_LABELS: Record<string, { active: string; done: string }> = {
  add_concept: { active: '사전에 등록하는 중', done: '사전에 등록함' },
}

function stepLabel(step: ChatActivityStep) {
  if (step.kind === 'thinking') return step.status === 'active' ? '생각하는 중' : '생각함'
  const label = step.toolName ? TOOL_LABELS[step.toolName] : undefined
  if (label) return step.status === 'active' ? label.active : label.done
  const verb = step.status === 'active' ? '호출 중' : '호출 완료'
  return `${step.toolName} 도구 ${verb}`
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [steps, setSteps] = useState<ChatActivityStep[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  // 패널을 연 동안 주고받은 메시지는 서버에서 한 대화로 묶인다. 첫 응답의 session
  // 이벤트로 받은 id를 들고 있다가 이후 메시지에 실어 보낸다.
  const sessionIdRef = useRef<number | null>(null)
  const queryClient = useQueryClient()

  // 패널이 닫히면(언마운트) 진행 중이던 스트림 읽기를 끊는다 — 백그라운드에서
  // 계속 읽어봤자 반영할 화면이 없다.
  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, steps])

  function handleEvent(event: ChatStreamEvent) {
    if (event.type === 'session') {
      sessionIdRef.current = event.session_id
      return
    }

    if (event.type === 'thinking') {
      useAiActivityStore.getState().setPhase('thinking')
      setSteps((prev) => [
        ...prev.map((s) => ({ ...s, status: 'done' as const })),
        { id: crypto.randomUUID(), kind: 'thinking', status: 'active' },
      ])
      return
    }

    if (event.type === 'tool_call') {
      useAiActivityStore.getState().setPhase('tool')
      setSteps((prev) => [
        ...prev.map((s) => ({ ...s, status: 'done' as const })),
        { id: crypto.randomUUID(), kind: 'tool', toolName: event.name, status: 'active' },
      ])
      return
    }

    if (event.type === 'tool_result') {
      // 채팅에서 사전에 새 개념이 들어가면 사이드바 개수·사전 목록이 바로 반영되게 한다.
      if (event.name === 'add_concept') {
        queryClient.invalidateQueries({ queryKey: ['concepts'] })
      }
      setSteps((prev) =>
        prev.map((s) =>
          s.kind === 'tool' && s.toolName === event.name && s.status === 'active'
            ? { ...s, status: 'done' }
            : s,
        ),
      )
      return
    }

    // content: 이번 턴의 진행 상황 트레일은 목적을 다했으니 지우고, 최종 답변만 말풍선으로 남긴다.
    setSteps([])
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'assistant', text: event.text, createdAt: Date.now() },
    ])
    flashAiPhase('done')
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || isSending) return

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text, createdAt: Date.now() },
    ])
    setInput('')
    setError(null)
    setSteps([])
    setIsSending(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      await streamChat(text, sessionIdRef.current, handleEvent, controller.signal)
    } catch (err) {
      if (controller.signal.aborted) return
      setSteps([])
      setError(err instanceof Error ? err.message : '채팅 요청에 실패했습니다.')
      flashAiPhase('error')
    } finally {
      // 언마운트(패널 닫기)가 이 요청을 abort시킨 경우엔 화면이 이미 사라진
      // 뒤이므로 setState를 건드리지 않는다 — abortRef만 정리한다.
      if (!controller.signal.aborted) setIsSending(false)
      abortRef.current = null
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      if (sessionIdRef.current !== null) {
        queryClient.invalidateQueries({ queryKey: ['chat-session', sessionIdRef.current] })
      }
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showEmptyState = messages.length === 0 && steps.length === 0 && !error

  return (
    <Panel>
      <Header>
        <Title>AI 채팅</Title>
        <CloseButton onClick={onClose} aria-label="채팅 닫기">
          ×
        </CloseButton>
      </Header>

      <MessageList ref={listRef}>
        {showEmptyState && (
          <EmptyState>
            <EmptyAvatar src={AVATAR_SRC} alt="" />
            <Muted>무엇이든 물어보세요.</Muted>
          </EmptyState>
        )}

        {messages.map((message) => (
          <ChatMessageBubble key={message.id} role={message.role} text={message.text} />
        ))}

        {steps.length > 0 && (
          <Row $role="assistant">
            <Avatar src={AVATAR_SRC} alt="AI" />
            <ActivityBubble>
              {steps.map((step) => (
                <StepRow key={step.id} $status={step.status}>
                  <StepIcon>{step.kind === 'thinking' ? '🧠' : '🔧'}</StepIcon>
                  <StepLabel>{stepLabel(step)}</StepLabel>
                  {step.status === 'active' ? <ThinkingDots /> : <StepDone>✓</StepDone>}
                </StepRow>
              ))}
            </ActivityBubble>
          </Row>
        )}

        {error && <ErrorText>{error}</ErrorText>}
      </MessageList>

      <InputBar>
        <ChatTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          rows={1}
          disabled={isSending}
        />
        <SendButton onClick={handleSend} disabled={!input.trim() || isSending} aria-label="전송">
          <FiSend size={16} />
        </SendButton>
      </InputBar>
    </Panel>
  )
}
