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

export const SubmissionCard = styled(GlassCard)`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${cardHoverLift}
`

export const SubmissionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const ProblemTag = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

export const LangTag = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.ink3};
`

export const ScoreTag = styled.span<{ $passed: boolean }>`
  margin-left: auto;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.$passed ? '#25cfa0' : p.theme.color.ink3)};
`

export const SubmissionDate = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.ink4};
`

export const SubmissionBody = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink2};
`
