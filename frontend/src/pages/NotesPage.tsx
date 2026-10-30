import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import ConfirmDialog, { DeleteIconButton } from '../components/ConfirmDialog'
import { flashAiPhase } from '../store/useAiActivityStore'
import { Button, ErrorText, Muted, Textarea } from '../styles/shared'
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
  EditIconButton,
  EditActions,
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

  // 한 번에 메모 하나만 수정한다. 저장하면 서버가 언급 개념을 LLM으로 다시 추출한다.
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const updateNote = useMutation({
    mutationFn: ({ id, body }: { id: number; body: string }) => api.updateNote(id, body),
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: () => {
      flashAiPhase('done')
      queryClient.invalidateQueries({ queryKey: ['notes-all'] })
      // 언급 개념이 바뀌었을 수 있어 개념별 메모("언급됨" 포함) 전부를 갱신한다.
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      setEditingId(null)
    },
    onError: () => flashAiPhase('error'),
  })

  const startEdit = (id: number, body: string) => {
    setEditingId(id)
    setDraft(body)
    updateNote.reset()
  }

  const cancelEdit = () => {
    setEditingId(null)
    updateNote.reset()
  }

  const saveEdit = (id: number, original: string) => {
    const body = draft.trim()
    if (!body) return
    // 본문이 그대로면 저장할 게 없다 — LLM 호출 없이 닫는다.
    if (body === original) {
      cancelEdit()
      return
    }
    updateNote.mutate({ id, body })
  }

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
        {notes.map((n) => {
          const isEditing = editingId === n.id
          return (
            <NoteCard
              key={n.id}
              $editing={isEditing}
              onClick={() => {
                if (!isEditing) navigate(`/concepts/${n.concept_id}`)
              }}
            >
              <NoteMeta>
                <ConceptTag>{n.concept_term}</ConceptTag>
                <NoteMetaRight>
                  <NoteDate>{formatDate(n.created_at)}</NoteDate>
                  {!isEditing && (
                    <EditIconButton
                      aria-label="메모 수정"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(n.id, n.body)
                      }}
                    >
                      <FiEdit2 size={14} />
                    </EditIconButton>
                  )}
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
              {isEditing ? (
                <>
                  <Textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    rows={4}
                    autoFocus
                    disabled={updateNote.isPending}
                  />
                  {updateNote.isError && (
                    <ErrorText>저장하지 못했습니다. 다시 시도해 주세요.</ErrorText>
                  )}
                  <EditActions>
                    <Button $variant="ghost" onClick={cancelEdit} disabled={updateNote.isPending}>
                      취소
                    </Button>
                    <Button
                      onClick={() => saveEdit(n.id, n.body)}
                      disabled={!draft.trim() || updateNote.isPending}
                    >
                      {updateNote.isPending ? '저장 중…' : '저장'}
                    </Button>
                  </EditActions>
                </>
              ) : (
                <NoteBody>{n.body}</NoteBody>
              )}
            </NoteCard>
          )
        })}
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
