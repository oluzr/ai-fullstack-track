import styled from 'styled-components'

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`

export const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const ModalTitle = styled.div`
  font-size: 23px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

export const ModalSubtitle = styled.div`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

export const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  color: ${(p) => p.theme.color.ink4};
  cursor: pointer;
  line-height: 1;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`

export const FieldLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.06em;
`

export const CategoryRow = styled.div`
  display: flex;
  gap: 8px;
`


export const SingleMeaning = styled.div`
  background: ${(p) => p.theme.surface.solid};
  border: 1px solid ${(p) => p.theme.border.fieldbd};
  border-radius: ${(p) => p.theme.radius.sm};
  padding: 16px 18px;
  font-size: 14.5px;
  line-height: 1.75;
  color: ${(p) => p.theme.color.ink2};
`
