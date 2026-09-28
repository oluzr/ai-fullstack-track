import styled from 'styled-components'
import { Button, ErrorText, Modal, ModalActions, ModalOverlay, Muted } from '../styles/shared'

type Props = {
  message: string
  confirmLabel?: string
  isPending?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

// 되돌릴 수 없는 동작(삭제 등) 전에 한 번 묻는 확인창. 바깥을 누르면 취소된다.
export default function ConfirmDialog({
  message,
  confirmLabel = '삭제',
  isPending = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <ModalOverlay onClick={(e) => e.target === e.currentTarget && !isPending && onCancel()}>
      <Modal>
        <Muted>{message}</Muted>
        {error && <ErrorText>{error}</ErrorText>}
        <ModalActions>
          <Button $variant="secondary" onClick={onCancel} disabled={isPending}>
            취소
          </Button>
          <DangerButton onClick={onConfirm} disabled={isPending}>
            {confirmLabel}
          </DangerButton>
        </ModalActions>
      </Modal>
    </ModalOverlay>
  )
}

const DangerButton = styled(Button)`
  background: ${(p) => p.theme.color.error};
  box-shadow: none;
`

// 카드 안에 두는 작은 휴지통 버튼. 카드 자체가 클릭(이동) 가능하므로 호출하는
// 쪽에서 stopPropagation 해야 한다.
export const DeleteIconButton = styled.button`
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: none;
  color: ${(p) => p.theme.color.ink4};
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: ${(p) => p.theme.color.error};
    background: ${(p) => (p.theme.name === 'light' ? 'rgba(192,57,43,0.1)' : 'rgba(255,90,82,0.15)')};
  }
`
