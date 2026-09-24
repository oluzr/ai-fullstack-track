import { Muted } from '../styles/shared'
import { Panel, Header, Title, CloseButton, Body } from './ChatPanel.styles'

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  return (
    <Panel>
      <Header>
        <Title>AI 채팅</Title>
        <CloseButton onClick={onClose} aria-label="채팅 닫기">
          ×
        </CloseButton>
      </Header>
      <Body>
        <Muted>채팅 기능은 준비 중입니다.</Muted>
      </Body>
    </Panel>
  )
}
