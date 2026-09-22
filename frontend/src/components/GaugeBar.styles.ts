import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

export const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
`

export const Track = styled.div`
  position: relative;
  background: ${(p) => p.theme.border.line};
  border-radius: ${(p) => p.theme.radius.pill};
  height: 5px;
  overflow: hidden;
`

export const Fill = styled.div<{ $value: number }>`
  background: ${(p) => p.theme.gradient.gaugeFill};
  height: 100%;
  width: ${(p) => p.$value}%;
  transition: width 0.3s;
`
