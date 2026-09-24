import styled from 'styled-components'
import { glass, thinScrollbar } from '../styles/shared'

export const Panel = styled.aside`
  position: relative;
  width: 400px;
  flex: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.surface.solid};
  border-left: 1px solid ${(p) => p.theme.border.bd2};
  ${glass(40)}
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${(p) => p.theme.border.line};
`

export const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

export const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  line-height: 1;
  color: ${(p) => p.theme.color.ink4};
  cursor: pointer;

  &:hover {
    color: ${(p) => p.theme.color.ink};
  }
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  ${thinScrollbar}
`
