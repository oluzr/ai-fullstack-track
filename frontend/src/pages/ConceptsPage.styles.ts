import styled from 'styled-components'
import { cardHoverLift, glass, GlassCard } from '../styles/shared'

export const Page = styled.div`
  padding: 34px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 26px;
`

export const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`

export const HeaderText = styled.div`
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
  font-size: 33px;
  font-weight: 600;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
`

export const Subtitle = styled.div`
  font-size: 13px;
  color: ${(p) => p.theme.color.ink3};
`

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  background: ${(p) => p.theme.surface.glass5};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: 0 14px;
  height: 44px;
  width: 240px;
  ${glass(26)}
`

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: ${(p) => p.theme.color.ink};

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${(p) => p.theme.color.ink4};
  }
`

export const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
  gap: 18px;
`

export const Card = styled(GlassCard)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 176px;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;

  ${cardHoverLift}
`

export const CardTerm = styled.div`
  font-size: 19px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`

export const CardDefinition = styled.div`
  font-size: 13.5px;
  line-height: 1.65;
  color: ${(p) => p.theme.color.ink3};
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`
