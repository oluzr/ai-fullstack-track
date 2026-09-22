import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { api } from '../api'
import { Button, Muted, Textarea } from '../styles/shared'
import {
  Section,
  SectionTitle,
  NoteForm,
  NotesGroup,
  GroupLabel,
  NoteCard,
  NoteSource,
  NoteBody,
} from './NotesPanel.styles'

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
    <Section>
      <SectionTitle>메모</SectionTitle>
      <NoteForm>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="메모를 남겨보세요 (다른 등록된 개념을 언급하면 자동으로 연결됩니다)"
          rows={3}
        />
        <Button onClick={handleAdd} disabled={createNote.isPending} style={{ alignSelf: 'flex-start' }}>
          <FiPlus /> 메모 추가
        </Button>
      </NoteForm>

      <NotesGroup>
        <GroupLabel>내가 남긴 메모</GroupLabel>
        {ownNotes.length === 0 && <Muted>아직 메모가 없습니다.</Muted>}
        {ownNotes.map((n) => (
          <NoteCard key={n.id}>
            <NoteBody>{n.body}</NoteBody>
          </NoteCard>
        ))}
      </NotesGroup>

      <NotesGroup>
        <GroupLabel>다른 메모에서 언급됨</GroupLabel>
        {backlinkedNotes.length === 0 && <Muted>언급된 메모가 없습니다.</Muted>}
        {backlinkedNotes.map((n) => (
          <NoteCard key={n.id} $backlink>
            <NoteSource>{n.concept_term}에 속한 메모</NoteSource>
            <NoteBody>{n.body}</NoteBody>
          </NoteCard>
        ))}
      </NotesGroup>
    </Section>
  )
}
