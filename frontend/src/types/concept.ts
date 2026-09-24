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

export type ExplainResult = {
  explanation: string
}
