import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, glass } from '../styles/shared'

const Page = styled.div`
  display: flex;
  flex-direction: column;
`

const TopBar = styled.div`
  padding: 18px 34px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  background: ${(p) => p.theme.surface.glass2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${glass(34)}
`

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const TopBarTitle = styled.span`
  font-size: 15.5px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

const Tag = styled.span`
  font-size: 11px;
  font-weight: 700;
  background: rgba(16, 185, 138, 0.16);
  color: ${(p) => p.theme.color.acc};
  padding: 4px 10px;
  border-radius: ${(p) => p.theme.radius.pill};
`

const TopBarMeta = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 36px 24px;
  gap: 18px;
`

const Column = styled.div`
  width: 100%;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Prompt = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  color: ${(p) => p.theme.color.acc};
`

const Question = styled.div`
  font-size: 29px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
  line-height: 1.4;
`

const CodeBlock = styled.div`
  width: 100%;
  max-width: 650px;
  background: ${(p) => p.theme.surface.code};
  border: 1px solid ${(p) => p.theme.border.bd1};
  border-radius: ${(p) => p.theme.radius.lg};
  overflow: hidden;
  ${glass(26)}
`

const CodeFileName = styled.div`
  padding: 11px 18px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: #8ea3bd;
`

const Pre = styled.pre`
  margin: 0;
  padding: 20px 22px;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 13.5px;
  line-height: 1.8;
  color: #e2ecf7;
`

const Bubble = styled.div<{ $mine?: boolean }>`
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

const ResultBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${(p) => p.theme.surface.glass3};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.lg};
  padding: 18px 22px;
  ${glass(34)}
`

const Donut = styled.div`
  width: 54px;
  height: 54px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(#25cfa0 0% 70%, ${(p) => p.theme.border.track} 70% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

const DonutInner = styled.div`
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

const ResultText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

const ResultTitle = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: ${(p) => p.theme.color.acc};
`

const ResultDesc = styled.span`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

const InputRow = styled.div`
  margin-top: auto;
  width: 100%;
  max-width: 650px;
  display: flex;
  gap: 10px;
  align-items: center;
  background: ${(p) => p.theme.surface.glass5};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.md};
  padding: 13px 17px;
  ${glass(30)}
`

const InputPlaceholder = styled.span`
  flex: 1;
  font-size: 14.5px;
  color: ${(p) => p.theme.color.ink4};
`

export default function CodeReadPage() {
  const navigate = useNavigate()

  return (
    <Page>
      <TopBar>
        <TopBarLeft>
          <TopBarTitle>코드 읽기</TopBarTitle>
          <Tag>해시맵 한 번 순회</Tag>
        </TopBarLeft>
        <TopBarMeta>Python · Lv.2 (목업 화면)</TopBarMeta>
      </TopBar>

      <Body>
        <Column>
          <Prompt>이 코드, 무슨 일을 하나요?</Prompt>
          <Question>
            읽고 당신 한 문단으로 설명해 주세요.
            <br />
            맞으면 통과입니다.
          </Question>
        </Column>

        <CodeBlock>
          <CodeFileName>snippet.py</CodeFileName>
          <Pre>{`def f(xs, k):
    seen = {}
    for i, x in enumerate(xs):
        if k - x in seen:
            return [seen[k - x], i]
        seen[x] = i
    return []`}</Pre>
        </CodeBlock>

        <Column>
          <Bubble $mine>
            두 원소의 합이 k가 되는 인덱스 쌍을 찾습니다. 본 값을 딕셔너리에 저장해 두고 짝을 O(1)로
            찾아서 한 번만 순회해요.
          </Bubble>
          <Bubble>정확합니다. 중복 값이 있을 때도 이전 인덱스가 먼저 덮이지 않는다는 점만 덧붙이면
            완벽해요.</Bubble>

          <ResultBar>
            <Donut>
              <DonutInner>70</DonutInner>
            </Donut>
            <ResultText>
              <ResultTitle>통과</ResultTitle>
              <ResultDesc>이해도 52% → 70%. 다음은 직접 풀어보기입니다.</ResultDesc>
            </ResultText>
            <Button style={{ marginLeft: 'auto' }} onClick={() => navigate('/code/solve')}>
              문제 풀기
            </Button>
          </ResultBar>
        </Column>

        <InputRow>
          <InputPlaceholder>더 설명하기 (목업 화면 — 실제 채점은 준비 중입니다)</InputPlaceholder>
          <Button $variant="secondary" disabled>
            보내기
          </Button>
        </InputRow>
      </Body>
    </Page>
  )
}
