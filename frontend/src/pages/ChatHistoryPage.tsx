import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import ConfirmDialog, { DeleteIconButton } from '../components/ConfirmDialog'
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

  const queryClient = useQueryClient()
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const deleteSession = useMutation({
    mutationFn: api.deleteChatSession,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
      queryClient.removeQueries({ queryKey: ['chat-session', sessionId] })
      setPendingDeleteId(null)
    },
  })

  const closeDialog = () => {
    setPendingDeleteId(null)
    deleteSession.reset()
  }

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
            <DeleteIconButton
              aria-label="대화 삭제"
              onClick={(e) => {
                e.stopPropagation()
                setPendingDeleteId(s.id)
              }}
            >
              <FiTrash2 size={14} />
            </DeleteIconButton>
          </SessionCard>
        ))}
      </List>

      {pendingDeleteId !== null && (
        <ConfirmDialog
          message="이 대화를 삭제할까요? 대화 안의 메시지도 모두 사라집니다."
          isPending={deleteSession.isPending}
          error={deleteSession.isError ? '삭제하지 못했습니다. 다시 시도해 주세요.' : null}
          onConfirm={() => deleteSession.mutate(pendingDeleteId)}
          onCancel={closeDialog}
        />
      )}
    </Page>
  )
}
