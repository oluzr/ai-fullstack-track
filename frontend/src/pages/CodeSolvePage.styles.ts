import styled from 'styled-components'
import { GlassCard, glass, thinScrollbar } from '../styles/shared'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const TopBar = styled.div`
  padding: 16px 28px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  background: ${(p) => p.theme.surface.glass2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${glass(34)}
`

export const TopBarTitle = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12.5px;
  color: ${(p) => p.theme.color.ink3};

  strong {
    color: ${(p) => p.theme.color.ink};
    font-weight: 400;
  }

  em {
    color: ${(p) => p.theme.color.acc};
    font-style: normal;
  }
`

export const LangTabs = styled.div`
  display: flex;
  gap: 7px;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
`

export const LangTab = styled.span<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${(p) => p.theme.radius.xs};
  background: ${(p) => (p.$active ? p.theme.color.btn : p.theme.border.bd1)};
  color: ${(p) => (p.$active ? '#fff' : p.theme.color.ink3)};
`

export const Grid = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
  padding: 24px;
  ${thinScrollbar}

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const ProblemPanel = styled(GlassCard)`
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

export const ProblemTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

export const ProblemBody = styled.div`
  font-size: 14.5px;
  line-height: 1.8;
  color: ${(p) => p.theme.color.ink3};
`

export const SubLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`

export const Constraints = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12.5px;
  line-height: 1.95;
  color: ${(p) => p.theme.color.ink3};
`

export const ExampleTable = styled.div`
  background: ${(p) => p.theme.surface.glass6};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.sm};
  overflow: hidden;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
`

export const ExampleRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr 0.9fr;
  padding: 9px 14px;
  background: ${(p) => (p.$header ? p.theme.border.seg : 'transparent')};
  color: ${(p) => (p.$header ? p.theme.color.ink3 : p.theme.color.ink2)};
  border-top: ${(p) => (p.$header ? 'none' : `1px solid ${p.theme.border.fieldbd}`)};
`

export const Hint = styled.div`
  margin-top: auto;
  font-size: 13px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink3};
`

export const EditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  /* overflow: hidden인 grid/flex 아이템은 브라우저가 자동 최소 높이를
     0으로 취급해 내용 대신 박스 자체를 찌그러뜨릴 수 있어 명시적으로 막는다 */
  min-height: min-content;
  background: ${(p) => p.theme.surface.code};
  border: 1px solid ${(p) => p.theme.border.bd1};
  border-radius: ${(p) => p.theme.radius.lg};
  overflow: hidden;
  ${glass(26)}
`

export const EditorHeader = styled.div`
  padding: 11px 20px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: #8ea3bd;
`

export const EditorBody = styled.div`
  flex: 1;
  display: flex;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 13.5px;
  line-height: 1.9;
`

export const LineNumbers = styled.div`
  padding: 18px 12px 18px 20px;
  color: #4a5c74;
  text-align: right;
  user-select: none;
`

export const Code = styled.pre`
  margin: 0;
  padding: 18px 20px 18px 8px;
  color: #e2ecf7;
  flex: 1;
`

export const EditorFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid ${(p) => p.theme.border.bd1};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const Shortcuts = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: #7e92ab;
`

export const SubmitButton = styled.button`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => p.theme.gradient.cta};
  color: #fff;
  padding: 10px 20px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
`
