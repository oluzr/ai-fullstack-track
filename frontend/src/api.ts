import type {
  Concept,
  InterpretResult,
  ExplainResult,
  QuizType,
  Quiz,
  QuizAnswerResult,
  Note,
  CodeProblemSummary,
  CodeProblem,
  CodeSubmitResult,
  CodeSubmission,
  ChatStreamEvent,
} from './types'

// dev: vite가 /api/* 를 backend로 리버스 프록시(prefix 제거)
// prod: nginx가 /api/* 를 backend로 리버스 프록시
// react-router 클라이언트 라우팅이 /concepts 같은 경로를 그대로 쓰므로
// API는 항상 /api 프리픽스로 구분한다.
const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `요청 실패: ${res.status}`)
  }
  return res.json()
}

export const api = {
  listConcepts: () => request<Concept[]>('/concepts'),

  interpretTerm: (term: string, exclude: string[] = []) =>
    request<InterpretResult>('/concepts/interpret', {
      method: 'POST',
      body: JSON.stringify({ term, exclude }),
    }),

  createConcept: (term: string, definition: string) =>
    request<Concept>('/concepts', {
      method: 'POST',
      body: JSON.stringify({ term, definition }),
    }),

  createQuiz: (conceptId: number, type: QuizType) =>
    request<Quiz>(`/concepts/${conceptId}/quiz`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    }),

  answerQuiz: (conceptId: number, question: string, userAnswer: string) =>
    request<QuizAnswerResult>(`/concepts/${conceptId}/quiz/answer`, {
      method: 'POST',
      body: JSON.stringify({ question, user_answer: userAnswer }),
    }),

  masterConcept: (conceptId: number) =>
    request<Concept>(`/concepts/${conceptId}/master`, { method: 'POST' }),

  explainConcept: (conceptId: number) =>
    request<ExplainResult>(`/concepts/${conceptId}/explain`, { method: 'POST' }),

  listAllNotes: () => request<Note[]>('/notes'),

  listNotes: (conceptId: number) => request<Note[]>(`/concepts/${conceptId}/notes`),

  createNote: (conceptId: number, body: string) =>
    request<Note>(`/concepts/${conceptId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    }),

  listCodeProblems: () => request<CodeProblemSummary[]>('/code/problems'),

  getCodeProblem: (problemId: number) => request<CodeProblem>(`/code/problems/${problemId}`),

  submitCode: (problemId: number, language: string, code: string) =>
    request<CodeSubmitResult>(`/code/problems/${problemId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ language, code }),
    }),

  listCodeSubmissions: () => request<CodeSubmission[]>('/code/submissions'),
}

// /chat은 결과를 한 번에 주지 않고, 줄마다 하나씩 JSON 이벤트(NDJSON)를 흘려준다
// (thinking → tool_call/tool_result 0회 이상 반복 → content). fetch로 직접 열어
// 응답 바디를 스트림으로 읽는 이유는, EventSource가 GET만 지원해서 POST 바디로
// 메시지를 보내야 하는 이 요청엔 못 쓰기 때문이다.
export async function streamChat(
  message: string,
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal,
  })
  if (!res.ok || !res.body) {
    const text = await res.text()
    throw new Error(text || `요청 실패: ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.trim()) onEvent(JSON.parse(line) as ChatStreamEvent)
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer) as ChatStreamEvent)
}
