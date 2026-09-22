import { useNavigate } from 'react-router-dom'
import { Button } from '../styles/shared'
import {
  Page,
  TopBar,
  TopBarLeft,
  TopBarTitle,
  Tag,
  TopBarMeta,
  Body,
  Column,
  Prompt,
  Question,
  CodeBlock,
  CodeFileName,
  Pre,
  Bubble,
  ResultBar,
  Donut,
  DonutInner,
  ResultText,
  ResultTitle,
  ResultDesc,
  InputRow,
  InputPlaceholder,
} from './CodeReadPage.styles'

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
