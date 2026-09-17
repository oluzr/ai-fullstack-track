import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import styled from 'styled-components'
import { api } from '../api'
import { Button, Muted, Textarea } from '../styles/shared'

const NoteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const NotesSection = styled.div`
  margin-top: 1rem;
`

const NoteCard = styled.div<{ $backlink?: boolean }>`
  background: ${(p) => (p.$backlink ? p.theme.colors.highlight : p.theme.colors.surface)};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-left: ${(p) =>
    p.$backlink ? `3px solid ${p.theme.colors.primary}` : `1px solid ${p.theme.colors.border}`};
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
`

const NoteSource = styled.p`
  font-size: 0.75rem;
  color: ${(p) => p.theme.colors.mutedStrong};
  margin: 0 0 0.25rem;
`

export default function NotesPanel({ conceptId }: { conceptId: number }) {
  const queryClient = useQueryClient()
  const { data: notes = [] } = useQuery({
    queryKey: ['notes', conceptId],
    queryFn: () => api.listNotes(conceptId),
  })

  const [body, setBody] = useState('')

  const createNote = useMutation({
    mutationFn: (value: string) => api.createNote(conceptId, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', conceptId] })
      setBody('')
    },
  })

  const handleAdd = () => {
    const value = body.trim()
    if (!value) return
    createNote.mutate(value)
  }

  const ownNotes = notes.filter((n) => !n.is_backlink)
  const backlinkedNotes = notes.filter((n) => n.is_backlink)

  return (
    <section>
      <h2>메모</h2>
      <NoteForm>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="메모를 남겨보세요 (다른 등록된 개념을 언급하면 자동으로 연결됩니다)"
          rows={3}
        />
        <Button onClick={handleAdd} disabled={createNote.isPending}>
          <FiPlus /> 메모 추가
        </Button>
      </NoteForm>

      <NotesSection>
        <h3>내가 남긴 메모</h3>
        {ownNotes.length === 0 && <Muted>아직 메모가 없습니다.</Muted>}
        {ownNotes.map((n) => (
          <NoteCard key={n.id}>
            <p>{n.body}</p>
          </NoteCard>
        ))}
      </NotesSection>

      <NotesSection>
        <h3>다른 메모에서 언급됨</h3>
        {backlinkedNotes.length === 0 && <Muted>언급된 메모가 없습니다.</Muted>}
        {backlinkedNotes.map((n) => (
          <NoteCard key={n.id} $backlink>
            <NoteSource>{n.concept_term}에 속한 메모</NoteSource>
            <p>{n.body}</p>
          </NoteCard>
        ))}
      </NotesSection>
    </section>
  )
}
