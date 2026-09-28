import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Muted } from '../styles/shared'
import {
  Page,
  Header,
  Breadcrumb,
  Title,
  Subtitle,
  List,
  SessionCard,
  SessionTitle,
  SessionMeta,
} from './ChatHistoryPage.styles'

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function ChatHistoryPage() {
  const navigate = useNavigate()
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: api.listChatSessions,
  })

  return (
    <Page>
      <Header>
        <Breadcrumb>/chats</Breadcrumb>
        <Title>채팅 내역</Title>
        <Subtitle>{sessions.length}개의 대화</Subtitle>
      </Header>

      <List>
        {!isLoading && sessions.length === 0 && <Muted>아직 나눈 대화가 없습니다.</Muted>}
        {sessions.map((s) => (
          <SessionCard key={s.id} onClick={() => navigate(`/chats/${s.id}`)}>
            <SessionTitle>{s.title}</SessionTitle>
            <SessionMeta>
              메시지 {s.message_count} · {formatDateTime(s.updated_at)}
            </SessionMeta>
          </SessionCard>
        ))}
      </List>
    </Page>
  )
}
