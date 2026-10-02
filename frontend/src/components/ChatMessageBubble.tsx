import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatRole } from '../types'
import { Avatar, Bubble, Markdown, Row } from './ChatPanel.styles'

export const AVATAR_SRC = '/favicon.png'

// 채팅 패널과 채팅 내역 상세 페이지가 같은 모양으로 말풍선을 그리도록 공용으로 뺐다.
// 어시스턴트 답변은 마크다운으로 오므로 렌더링하고, 사용자 입력은 그대로 보여준다.
export default function ChatMessageBubble({ role, text }: { role: ChatRole; text: string }) {
  return (
    <Row $role={role}>
      {role === 'assistant' && <Avatar src={AVATAR_SRC} alt="AI" />}
      <Bubble $role={role}>
        {role === 'assistant' ? (
          <Markdown>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </Markdown>
        ) : (
          text
        )}
      </Bubble>
    </Row>
  )
}
