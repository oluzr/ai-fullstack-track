import styled from 'styled-components'
import { GlassCard, glass } from '../styles/shared'

export const Page = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`

export const Card = styled(GlassCard)`
  width: 100%;
  max-width: 560px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  ${glass(38)}
`

export const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Title = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

export const Desc = styled.div`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const FieldLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.06em;
`
