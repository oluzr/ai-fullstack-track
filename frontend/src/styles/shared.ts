import styled from 'styled-components'

export const Button = styled.button<{ $secondary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${(p) => (p.$secondary ? p.theme.colors.secondary : p.theme.colors.primary)};
  color: ${(p) => (p.$secondary ? p.theme.colors.secondaryText : p.theme.colors.primaryText)};

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  font-family: inherit;
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 6px;
`

export const ErrorText = styled.p`
  color: ${(p) => p.theme.colors.error};
`

export const Muted = styled.p`
  color: ${(p) => p.theme.colors.muted};
  font-size: 0.9rem;
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
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${(p) => p.theme.colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Modal = styled.div<{ $wide?: boolean }>`
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  padding: 1.5rem;
  border-radius: 8px;
  max-width: ${(p) => (p.$wide ? '480px' : '320px')};
  width: ${(p) => (p.$wide ? '90%' : 'auto')};
  text-align: ${(p) => (p.$wide ? 'left' : 'center')};
`

export const ModalActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
`
