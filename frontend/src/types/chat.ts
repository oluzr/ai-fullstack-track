export type ChatRole = 'user' | 'assistant'

export type ChatStreamEvent =
  | { type: 'thinking' }
  | { type: 'tool_call'; name: string; args: Record<string, unknown> }
  | { type: 'tool_result'; name: string; result: unknown }
  | { type: 'content'; text: string }

export type ChatActivityStep = {
  id: string
  kind: 'thinking' | 'tool'
  toolName?: string
  status: 'active' | 'done'
}

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
  createdAt: number
}
