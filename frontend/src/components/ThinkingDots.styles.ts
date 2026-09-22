import styled, { keyframes } from 'styled-components'

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`

export const Dots = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: middle;
`

export const Dot = styled.span<{ $delay: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: ${bounce} 1.1s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;
`
