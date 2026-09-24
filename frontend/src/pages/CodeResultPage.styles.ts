import styled from 'styled-components'
import { GlassCard } from '../styles/shared'

export const Page = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`

export const Card = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
`

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Meta = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

export const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
`

export const Donut = styled.div<{ $pct: number }>`
  width: 104px;
  height: 104px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(#25cfa0 0% ${(p) => p.$pct}%, ${(p) => p.theme.border.track} ${(p) => p.$pct}% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DonutInner = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: ${(p) => p.theme.surface.solid};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const Score = styled.span`
  font-size: 27px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

export const ScoreMax = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 10px;
  color: ${(p) => p.theme.color.ink3};
`

export const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const FeedbackCard = styled(GlassCard)<{ $highlight?: boolean }>`
  padding: 15px 18px;
  display: flex;
  gap: 14px;
  ${(p) => p.$highlight && `border-color: rgba(37,207,160,0.35);`}
`

export const FeedbackLabel = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.acc};
  padding-top: 2px;
  white-space: nowrap;
`

export const FeedbackText = styled.span`
  font-size: 14px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink2};
`

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
