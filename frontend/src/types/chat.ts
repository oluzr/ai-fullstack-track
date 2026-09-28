export type ChatRole = 'user' | 'assistant'

export type ChatStreamEvent =
  | { type: 'session'; session_id: number }
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

// 서버에 저장된 채팅 내역 (/chat/sessions)
export type ChatSessionSummary = {
  id: number
  title: string
  message_count: number
  created_at: string
  updated_at: string
}

export type SavedChatMessage = {
  id: number
  role: ChatRole
  text: string
  created_at: string
}

export type ChatSession = {
  id: number
  title: string
  created_at: string
  updated_at: string
  messages: SavedChatMessage[]
}
