import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiArrowLeft, FiMessageCircle, FiTrash2 } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import ChatMessageBubble from '../components/ChatMessageBubble'
import ConfirmDialog from '../components/ConfirmDialog'
import { useChatStore } from '../store/useChatStore'
import { ErrorText, Muted } from '../styles/shared'
import { formatDateTime } from './ChatHistoryPage'
import {
  Page,
  Header,
  Title,
  Subtitle,
  BackLink,
  DeleteLink,
  TopBarActions,
  TopBar,
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

  const continueSession = useChatStore((s) => s.continueSession)
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const deleteSession = useMutation({
    mutationFn: () => api.deleteChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      queryClient.removeQueries({ queryKey: ['chat-session', sessionId] })
      navigate('/chats')
    },
  })

  return (
    <Page>
      <TopBar>
        <BackLink onClick={() => navigate('/chats')}>
          <FiArrowLeft /> 목록으로
        </BackLink>
        {session && (
          <TopBarActions>
            <BackLink onClick={() => continueSession(session.id)}>
              <FiMessageCircle /> 이어서 대화하기
            </BackLink>
            <DeleteLink onClick={() => setConfirmOpen(true)}>
              <FiTrash2 /> 삭제
            </DeleteLink>
          </TopBarActions>
        )}
      </TopBar>

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

      {confirmOpen && (
        <ConfirmDialog
          message="이 대화를 삭제할까요? 대화 안의 메시지도 모두 사라집니다."
          isPending={deleteSession.isPending}
          error={deleteSession.isError ? '삭제하지 못했습니다. 다시 시도해 주세요.' : null}
          onConfirm={() => deleteSession.mutate()}
          onCancel={() => {
            setConfirmOpen(false)
            deleteSession.reset()
          }}
        />
      )}
    </Page>
  )
}
