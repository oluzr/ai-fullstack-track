import styled from 'styled-components'
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

export const SessionCard = styled(GlassCard)`
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;

  ${cardHoverLift}
`

export const SessionTitle = styled.span`
  flex: 1;
  min-width: 0;
  font-size: 14.5px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SessionMeta = styled.span`
  flex: none;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.ink4};
`

// 상세 페이지
export const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  background: none;
  border: none;
  color: ${(p) => p.theme.color.acc};
  font-size: 13.5px;
  cursor: pointer;
  padding: 0;
`

export const Conversation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 760px;
`
