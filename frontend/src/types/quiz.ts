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
