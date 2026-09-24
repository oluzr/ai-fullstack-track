import styled, { css } from 'styled-components'

export const glass = (blurPx = 30, useSaturate = true) => css`
  backdrop-filter: blur(${blurPx}px)${useSaturate ? ' saturate(120%)' : ''};
  -webkit-backdrop-filter: blur(${blurPx}px)${useSaturate ? ' saturate(120%)' : ''};
`

// 얇고 테마별로 색이 갈리는 스크롤바. overflow-y: auto인 컨테이너에 붙여서 쓴다.
export const thinScrollbar = css`
  scrollbar-width: thin;
  scrollbar-color: ${(p) => (p.theme.name === 'light' ? '#ffffff' : p.theme.color.ink4)} ${(p) => p.theme.border.track};

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.border.track};
    border-radius: ${(p) => p.theme.radius.pill};
  }
  &::-webkit-scrollbar-thumb {
    background: ${(p) => (p.theme.name === 'light' ? '#ffffff' : p.theme.color.ink4)};
    border: ${(p) => (p.theme.name === 'light' ? '1px solid rgba(0,0,0,0.08)' : 'none')};
    border-radius: ${(p) => p.theme.radius.pill};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(p) => (p.theme.name === 'light' ? '#f2f2f2' : p.theme.color.ink3)};
  }
`

// 클릭 가능한 GlassCard 계열에서 공통으로 쓰는 hover. 라이트(뉴모피즘)는 그림자를
// 더 진하게 눌러서 "떠오르는" 느낌을, 다크(유리질감)는 배경/그림자를 밝게 바꾼다.
export const cardHoverLift = css`
  &:hover {
    ${(p) =>
      p.theme.name === 'light'
        ? css`
            box-shadow: 10px 10px 20px rgba(163, 177, 198, 0.65), -10px -10px 20px rgba(255, 255, 255, 0.9);
          `
        : css`
            background: ${p.theme.surface.glass6};
            box-shadow: 0 22px 44px -24px rgba(23, 60, 92, 0.8);
          `}
  }
`

export const GlassCard = styled.div`
  border-radius: ${(p) => p.theme.radius.lg};

  ${(p) =>
    p.theme.name === 'light'
      ? css`
          /* 뉴모피즘: 배경보다 살짝 밝은 색 + 좌상단 밝은 하이라이트/우하단 진한
             그림자로 "같은 재질에서 눌려 나온" 느낌을 낸다. 테두리·블러는 없앤다. */
          background: #f3f2f22d;
          border: 1px solid transparent;
          box-shadow: 8px 8px 16px rgba(163, 177, 198, 0.55), -8px -8px 16px rgba(255, 255, 255, 1);
        `
      : css`
          background: ${p.theme.surface.glass2};
          border: 1px solid ${p.theme.border.bd2};
          box-shadow: 0 18px 38px -28px rgba(23, 60, 92, 0.75);
          ${glass(34)}
        `}
`

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 12px 20px;
  border: none;
  border-radius: ${(p) => p.theme.radius.sm};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.1s;

  ${(p) =>
    (!p.$variant || p.$variant === 'primary') &&
    css`
      background: ${p.theme.gradient.cta};
      color: #fff;
      box-shadow: ${p.theme.shadow.cta};
    `}

  ${(p) =>
    p.$variant === 'secondary' &&
    css`
      background: ${p.theme.surface.glass2};
      border: 1px solid ${p.theme.border.bd2};
      color: ${p.theme.color.ink3};
      ${glass(26)}
    `}

  ${(p) =>
    p.$variant === 'ghost' &&
    css`
      background: transparent;
      color: ${p.theme.color.ink3};
    `}

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
  }
`

export const Pill = styled.button<{ $active?: boolean }>`
  padding: 8px 15px;
  border-radius: ${(p) => p.theme.radius.pill};
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 600 : 400)};
  cursor: pointer;
  white-space: nowrap;
  background: ${(p) => (p.$active ? p.theme.color.btn : p.theme.surface.glass3)};
  color: ${(p) => (p.$active ? '#fff' : p.theme.color.ink3)};
  border: 1px solid ${(p) => (p.$active ? 'transparent' : p.theme.border.bd2)};
`

export const Toggle = styled.span<{ $on?: boolean }>`
  width: 38px;
  height: 22px;
  flex: none;
  border-radius: ${(p) => p.theme.radius.pill};
  background: ${(p) => (p.$on ? p.theme.gradient.cta : p.theme.border.track)};
  display: inline-flex;
  align-items: center;
  padding: 2px;
  justify-content: ${(p) => (p.$on ? 'flex-end' : 'flex-start')};
  cursor: pointer;
  transition: background 0.15s;

  &::after {
    content: '';
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 6px -2px rgba(15, 40, 70, 0.7);
  }
`

export const SegmentedControl = styled.div`
  display: flex;
  gap: 4px;
  background: ${(p) => p.theme.border.seg};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: 4px;
`

export const SegmentedOption = styled.button<{ $active?: boolean }>`
  flex: 1;
  text-align: center;
  padding: 10px 0;
  border: none;
  border-radius: ${(p) => p.theme.radius.xs};
  font-size: 14px;
  font-weight: ${(p) => (p.$active ? 700 : 400)};
  cursor: pointer;
  background: ${(p) => (p.$active ? p.theme.surface.solid : 'transparent')};
  color: ${(p) => (p.$active ? p.theme.color.ink : p.theme.color.ink3)};
  box-shadow: ${(p) => (p.$active ? '0 4px 12px -6px rgba(23,60,92,0.5)' : 'none')};
`

export const Input = styled.input`
  padding: 13px 16px;
  font-family: inherit;
  font-size: 15.5px;
  background: ${(p) => p.theme.surface.field};
  color: ${(p) => p.theme.color.ink};
  border: 1px solid ${(p) => p.theme.border.fieldbd};
  border-radius: ${(p) => p.theme.radius.sm};

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.color.acc};
    box-shadow: 0 0 0 4px rgba(37, 207, 160, 0.15);
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 13px 16px;
  font-family: inherit;
  font-size: 14.5px;
  background: ${(p) => p.theme.surface.field};
  color: ${(p) => p.theme.color.ink};
  border: 1px solid ${(p) => p.theme.border.fieldbd};
  border-radius: ${(p) => p.theme.radius.sm};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.color.acc};
  }
`

export const ErrorText = styled.p`
  color: ${(p) => p.theme.color.error};
  font-size: 13.5px;
`

export const Muted = styled.p`
  color: ${(p) => p.theme.color.ink3};
  font-size: 13.5px;
`

export const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`

export const ChoiceLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14.5px;
  line-height: 1.5;
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${(p) => p.theme.surface.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
`

export const Modal = styled(GlassCard)<{ $wide?: boolean }>`
  ${glass(40)}
  background: ${(p) => p.theme.surface.glass5};
  color: ${(p) => p.theme.color.ink};
  padding: 30px;
  border-radius: ${(p) => p.theme.radius.xl};
  max-width: ${(p) => (p.$wide ? '480px' : '360px')};
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
`
