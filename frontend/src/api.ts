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

export type Concept = {
  id: number
  term: string
  definition: string
  status: 'active' | 'mastered'
  mastery_gauge: number
  created_at: string
}

export type InterpretResult = {
  is_ambiguous: boolean
  meanings: string[]
}

export type QuizType = 'mc' | 'free'

export type Quiz = {
  type: QuizType
  question: string
  choices: string[] | null
}

export type QuizAnswerResult = {
  is_correct: boolean | null
  score: number | null
  feedback: string | null
  mastery_gauge: number
  mastery_ready: boolean
}

export type ExplainResult = {
  explanation: string
}

export type Note = {
  id: number
  concept_id: number
  concept_term: string
  body: string
  created_at: string
  is_backlink: boolean
}

export type CodeProblemSummary = {
  id: number
  title: string
  difficulty: string
}

export type CodeExample = {
  input: string
  output: string
}

export type CodeProblem = {
  id: number
  title: string
  prompt: string
  constraints: string
  examples: CodeExample[]
  difficulty: string
}

export type CodeFeedback = {
  correctness: string
  complexity: string
  improvement: string
}

export type CodeSubmitResult = {
  passed: boolean
  score: number
  feedback: CodeFeedback
}

export type CodeSubmission = {
  id: number
  problem_id: number
  problem_title: string
  language: string
  passed: boolean
  score: number
  feedback: CodeFeedback
  created_at: string
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
