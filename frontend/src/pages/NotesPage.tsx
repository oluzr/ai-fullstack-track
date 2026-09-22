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
  NoteCard,
  NoteMeta,
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
              <NoteDate>{formatDate(n.created_at)}</NoteDate>
            </NoteMeta>
            <NoteBody>{n.body}</NoteBody>
          </NoteCard>
        ))}
      </List>
    </Page>
  )
}
