import styled from 'styled-components'
import { GlassCard } from '../styles/shared'

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

export const NoteForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const NotesGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const GroupLabel = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink3};
`

export const NoteCard = styled(GlassCard)<{ $backlink?: boolean }>`
  padding: 15px 18px;
  border-left: ${(p) => (p.$backlink ? `3px solid ${p.theme.color.acc}` : undefined)};
`

export const NoteSource = styled.p`
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
  margin: 0 0 0.25rem;
`

export const NoteBody = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink2};
`
