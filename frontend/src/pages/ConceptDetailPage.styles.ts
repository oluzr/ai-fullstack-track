import styled from 'styled-components'
import { GlassCard } from '../styles/shared'

export const Page = styled.div`
  padding: 34px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  max-width: 720px;
`

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

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Term = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

export const Definition = styled.p`
  font-size: 14.5px;
  line-height: 1.8;
  color: ${(p) => p.theme.color.ink3};
`

export const ExplainRow = styled.div`
  display: flex;
`

export const ExplainCard = styled.div`
  padding: 18px 20px;
  font-size: 14.5px;
  line-height: 1.8;
  color: ${(p) => p.theme.color.ink2};
  border-left: 6px solid ${(p) => p.theme.border.bd3};
  background: ${(p) => p.theme.surface.explainBody}
`

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

export const QuizButtons = styled.div`
  display: flex;
  gap: 10px;
`

export const QuizCard = styled(GlassCard)`
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Question = styled.p`
  font-size: 15.5px;
  color: ${(p) => p.theme.color.ink};
`

export const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const Donut = styled.div<{ $pct: number }>`
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(
    ${(p) => p.theme.color.acc} 0% ${(p) => p.$pct}%,
    ${(p) => p.theme.border.track} ${(p) => p.$pct}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DonutInner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) => p.theme.surface.solid};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
`

export const ResultText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const ResultVerdict = styled.span<{ $correct?: boolean }>`
  font-size: 17px;
  font-weight: 800;
  color: ${(p) => (p.$correct === false ? p.theme.color.error : p.theme.color.acc)};
`

export const ResultDetail = styled.span`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`
