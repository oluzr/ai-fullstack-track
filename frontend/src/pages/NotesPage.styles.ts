import styled from 'styled-components'
import { DeleteIconButton } from '../components/ConfirmDialog'
import { cardHoverLift, GlassCard } from '../styles/shared'

export const Page = styled.div`
  padding: 34px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Breadcrumb = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

export const Title = styled.h1`
  font-size: 38px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
`

export const Subtitle = styled.div`
  font-size: 14px;
  color: ${(p) => p.theme.color.ink3};
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 720px;
`

export const NoteCard = styled(GlassCard)<{ $editing?: boolean }>`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${(p) => (p.$editing ? 'default' : 'pointer')};
  transition: background 0.15s, box-shadow 0.15s;

  ${(p) => !p.$editing && cardHoverLift}
`

export const NoteMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const ConceptTag = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => p.theme.color.acc};
  background: rgba(16, 185, 138, 0.16);
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.radius.pill};
`

export const NoteDate = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.ink4};
`

export const NoteBody = styled.p`
  font-size: 14.5px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink2};
`

export const NoteMetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

// 삭제 버튼과 같은 모양이되, 위험한 동작이 아니니 hover 색은 강조색으로.
export const EditIconButton = styled(DeleteIconButton)`
  &:hover {
    color: ${(p) => p.theme.color.acc};
    background: rgba(16, 185, 138, 0.14);
  }
`

export const EditActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`
