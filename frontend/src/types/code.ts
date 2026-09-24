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
