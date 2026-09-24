import styled, { keyframes } from "styled-components";
import { glass, thinScrollbar } from "../styles/shared";

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
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: none;
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${(p) => p.theme.border.line};
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.01em;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  line-height: 1;
  color: ${(p) => p.theme.color.ink4};
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${(p) => p.theme.color.ink};
  }
`;

export const MessageList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  ${thinScrollbar}
`;

export const EmptyState = styled.div`
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 0 24px;
`;

export const EmptyAvatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  opacity: 0.55;
`;

export const Row = styled.div<{ $role: "user" | "assistant" }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  justify-content: ${(p) => (p.$role === "user" ? "flex-end" : "flex-start")};
`;

export const Avatar = styled.img<{ $size?: number }>`
  width: ${(p) => p.$size ?? 26}px;
  height: ${(p) => p.$size ?? 26}px;
  border-radius: 50%;
  object-fit: cover;
  flex: none;
`;

// role별로 등장 방식을 다르게 준다: 사용자가 보낸 말풍선은 "전송"이라는 제스처가
// 막 일어난 직후라 살짝 튀어오르며 자리잡고(모멘텀), 어시스턴트 답장은 스스로
// 도착한 것이라 오버슈트 없이 차분히 자리잡는다(critically damped).
const bubbleIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOnly = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Bubble = styled.div<{ $role: "user" | "assistant" }>`
  max-width: 78%;
  padding: 10px 14px;
  border-radius: ${(p) => p.theme.radius.lg};
  font-size: 14px;
  line-height: 1.55;
  letter-spacing: -0.005em;
  white-space: pre-wrap;
  word-break: break-word;
  animation: ${bubbleIn} 0.4s
    ${(p) =>
      p.$role === "user"
        ? "cubic-bezier(0.34, 1.56, 0.64, 1)"
        : "cubic-bezier(0.22, 1, 0.36, 1)"}
    both;

  ${(p) =>
    p.$role === "user"
      ? `
    background: ${p.theme.gradient.bubble};
    color: #fff;
    border-bottom-right-radius: 4px;
  `
      : `
    background: ${p.theme.name === "light" ? "#ececec" : "#ffffff13"};
    color: ${p.theme.color.ink};
    border: 1px solid ${p.theme.border.fieldbd};
    border-bottom-left-radius: 4px;
  `}

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeOnly} 0.15s ease both;
  }
`;

const activityIn = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const ActivityBubble = styled.div`
  max-width: 78%;
  padding: 10px 14px;
  border-radius: ${(p) => p.theme.radius.lg};
  border-bottom-left-radius: 4px;
  background: ${(p) =>
    p.theme.name === "light" ? "rgb(245 245 245)" : "#ffffff13"};
  border: 1px solid ${(p) => p.theme.border.fieldbd};
  display: flex;
  flex-direction: column;
  gap: 7px;
  animation: ${activityIn} 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  ${glass(16)}

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeOnly} 0.15s ease both;
  }
`;

const stepIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const StepRow = styled.div<{ $status: "active" | "done" }>`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: ${(p) =>
    p.$status === "active" ? p.theme.color.ink2 : p.theme.color.ink4};
  opacity: ${(p) => (p.$status === "active" ? 1 : 0.7)};
  transition:
    opacity 0.25s,
    color 0.25s;
  animation: ${stepIn} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeOnly} 0.15s ease both;
  }
`;

export const StepIcon = styled.span`
  flex: none;
  font-size: 12px;
  line-height: 1;
`;

export const StepLabel = styled.span`
  flex: 1;
  min-width: 0;
`;

export const StepDone = styled.span`
  flex: none;
  color: ${(p) => p.theme.color.acc};
  font-size: 11px;
`;

export const InputBar = styled.div`
  flex: none;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid ${(p) => p.theme.border.line};
`;

export const ChatTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  max-height: 120px;
  padding: 10px 13px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  color: ${(p) => p.theme.color.ink};
  background: ${(p) => p.theme.surface.field};
  border: 1px solid ${(p) => p.theme.border.fieldbd};
  border-radius: ${(p) => p.theme.radius.md};
  resize: none;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.color.acc};
  }

  &:disabled {
    opacity: 0.6;
  }

  &::placeholder {
    color: ${(p) => p.theme.color.ink4};
  }
`;

export const SendButton = styled.button`
  flex: none;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: ${(p) => p.theme.gradient.cta};
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.15s,
    opacity 0.15s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
    transform: none;
  }
`;
