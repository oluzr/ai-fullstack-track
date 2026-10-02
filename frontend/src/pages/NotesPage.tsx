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
  NoteCard,
  NoteMeta,
  NoteMetaRight,
  ConceptTag,
  NoteDate,
  NoteBody,
} from './NotesPage.styles'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export default function NotesPage() {
  const navigate = useNavigate()
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes-all'],
    queryFn: api.listAllNotes,
  })

  const queryClient = useQueryClient()
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const deleteNote = useMutation({
    mutationFn: api.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes-all'] })
      // 지운 메모가 다른 개념의 "언급됨" 목록에도 걸려 있을 수 있어 개념별 메모 전부를 갱신한다.
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setPendingDeleteId(null)
    },
  })

  const closeDialog = () => {
    setPendingDeleteId(null)
    deleteNote.reset()
  }

  return (
    <Page>
      <Header>
        <Breadcrumb>/concepts/notes</Breadcrumb>
        <Title>메모</Title>
        <Subtitle>{notes.length}개의 메모</Subtitle>
      </Header>

      <List>
        {!isLoading && notes.length === 0 && <Muted>아직 남긴 메모가 없습니다.</Muted>}
        {notes.map((n) => (
          <NoteCard key={n.id} onClick={() => navigate(`/concepts/${n.concept_id}`)}>
            <NoteMeta>
              <ConceptTag>{n.concept_term}</ConceptTag>
              <NoteMetaRight>
                <NoteDate>{formatDate(n.created_at)}</NoteDate>
                <DeleteIconButton
                  aria-label="메모 삭제"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPendingDeleteId(n.id)
                  }}
                >
                  <FiTrash2 size={14} />
                </DeleteIconButton>
              </NoteMetaRight>
            </NoteMeta>
            <NoteBody>{n.body}</NoteBody>
          </NoteCard>
        ))}
      </List>

      {pendingDeleteId !== null && (
        <ConfirmDialog
          message="이 메모를 삭제할까요? 다른 개념에 연결된 언급도 함께 사라집니다."
          isPending={deleteNote.isPending}
          error={deleteNote.isError ? '삭제하지 못했습니다. 다시 시도해 주세요.' : null}
          onConfirm={() => deleteNote.mutate(pendingDeleteId)}
          onCancel={closeDialog}
        />
      )}
    </Page>
  )
}
