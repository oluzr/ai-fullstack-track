import styled from 'styled-components'
import { glass, thinScrollbar } from '../styles/shared'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const TopBar = styled.div`
  padding: 18px 34px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  background: ${(p) => p.theme.surface.glass2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${glass(34)}
`

export const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const TopBarTitle = styled.span`
  font-size: 15.5px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

export const Tag = styled.span`
  font-size: 11px;
  font-weight: 700;
  background: rgba(16, 185, 138, 0.16);
  color: ${(p) => p.theme.color.acc};
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.radius.pill};
`

export const TopBarMeta = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

export const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 36px 24px;
  gap: 18px;
  ${thinScrollbar}
`

export const Column = styled.div`
  width: 100%;
  max-width: 650px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Prompt = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  color: ${(p) => p.theme.color.acc};
`

export const Question = styled.div`
  font-size: 29px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
  line-height: 1.4;
`

export const CodeBlock = styled.div`
  width: 100%;
  max-width: 650px;
  flex-shrink: 0;
  background: ${(p) => p.theme.surface.code};
  border: 1px solid ${(p) => p.theme.border.bd1};
  border-radius: ${(p) => p.theme.radius.lg};
  overflow: hidden;
  ${glass(26)}
`

export const CodeFileName = styled.div`
  padding: 11px 18px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: #8ea3bd;
`

export const Pre = styled.pre`
  margin: 0;
  padding: 20px 22px;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 13.5px;
  line-height: 1.8;
  color: #e2ecf7;
`

export const Bubble = styled.div<{ $mine?: boolean }>`
  align-self: ${(p) => (p.$mine ? 'flex-end' : 'flex-start')};
  max-width: 500px;
  padding: 15px 19px;
  font-size: 14.5px;
  line-height: 1.7;
  border-radius: 18px;
  ${(p) =>
    p.$mine
      ? `background:${p.theme.gradient.bubble}; color:#fff; border-bottom-right-radius:6px;`
      : `background:${p.theme.surface.glass5}; border:1px solid ${p.theme.border.bd2}; color:${p.theme.color.ink2}; border-bottom-left-radius:6px;`}
`

export const ResultBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${(p) => p.theme.surface.glass3};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.lg};
  padding: 18px 22px;
  ${glass(34)}
`

export const Donut = styled.div`
  width: 54px;
  height: 54px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(#25cfa0 0% 70%, ${(p) => p.theme.border.track} 70% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const DonutInner = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${(p) => p.theme.surface.solid};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
`

export const ResultText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const ResultTitle = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: ${(p) => p.theme.color.acc};
`

export const ResultDesc = styled.span`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

export const InputRow = styled.div`
  margin-top: auto;
  width: 100%;
  max-width: 650px;
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  background: ${(p) => p.theme.surface.glass5};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.md};
  padding: 13px 17px;
  ${glass(30)}
`

export const InputPlaceholder = styled.span`
  flex: 1;
  font-size: 14.5px;
  color: ${(p) => p.theme.color.ink4};
`
