import styled from 'styled-components'
import { GlassCard } from '../styles/shared'

export const Page = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`

export const Card = styled(GlassCard)`
  padding: 40px;
  max-width: 420px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Title = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
`

export const Desc = styled.p`
  font-size: 14px;
  color: ${(p) => p.theme.color.ink3};
  line-height: 1.7;
`
