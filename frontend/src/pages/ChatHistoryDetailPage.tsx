import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import ChatMessageBubble from '../components/ChatMessageBubble'
import { ErrorText, Muted } from '../styles/shared'
import { formatDateTime } from './ChatHistoryPage'
import {
  Page,
  Header,
  Title,
  Subtitle,
  BackLink,
  Conversation,
} from './ChatHistoryPage.styles'

export default function ChatHistoryDetailPage() {
  const navigate = useNavigate()
  const sessionId = Number(useParams().id)
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: () => api.getChatSession(sessionId),
    enabled: Number.isFinite(sessionId),
  })

  return (
    <Page>
      <BackLink onClick={() => navigate('/chats')}>
        <FiArrowLeft /> 목록으로
      </BackLink>

      {isLoading && <Muted>불러오는 중…</Muted>}
      {error && <ErrorText>대화를 불러오지 못했습니다.</ErrorText>}

      {session && (
        <>
          <Header>
            <Title>{session.title}</Title>
            <Subtitle>
              {formatDateTime(session.created_at)} 시작 · 메시지 {session.messages.length}
            </Subtitle>
          </Header>

          <Conversation>
            {session.messages.map((m) => (
              <ChatMessageBubble key={m.id} role={m.role} text={m.text} />
            ))}
          </Conversation>
        </>
      )}
    </Page>
  )
}
