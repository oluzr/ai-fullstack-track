import { useNavigate } from 'react-router-dom'
import {
  Page,
  TopBar,
  TopBarTitle,
  LangTabs,
  LangTab,
  Grid,
  ProblemPanel,
  ProblemTitle,
  ProblemBody,
  SubLabel,
  Constraints,
  ExampleTable,
  ExampleRow,
  Hint,
  EditorPanel,
  EditorHeader,
  EditorBody,
  LineNumbers,
  Code,
  EditorFooter,
  Shortcuts,
  SubmitButton,
} from './CodeSolvePage.styles'

const SOLUTION_CODE = `def solution(numbers, target):
    seen = {}
    for i, n in enumerate(numbers):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []`

export default function CodeSolvePage() {
  const navigate = useNavigate()
  const lines = SOLUTION_CODE.split('\n').map((_, i) => i + 1)

  return (
    <Page>
      <TopBar>
        <TopBarTitle>
          문제 풀기 <strong>/ 두 수의 합</strong> <em>[lv2] (목업 화면)</em>
        </TopBarTitle>
        <LangTabs>
          <LangTab $active>python</LangTab>
          <LangTab>ts</LangTab>
          <LangTab>go</LangTab>
        </LangTabs>
      </TopBar>

      <Grid>
        <ProblemPanel>
          <div>
            <ProblemTitle>두 수의 합</ProblemTitle>
            <ProblemBody>
              정수 배열 numbers와 목표값 target이 주어질 때, 더해서 target이 되는 두 원소의 인덱스를
              오름차순으로 반환하세요.
            </ProblemBody>
          </div>
          <div>
            <SubLabel>제약사항</SubLabel>
            <Constraints>
              2 ≤ len(numbers) ≤ 10000
              <br />
              정답은 유일
              <br />
              같은 원소 재사용 불가
            </Constraints>
          </div>
          <div>
            <SubLabel>입출력 예</SubLabel>
            <ExampleTable>
              <ExampleRow $header>
                <span>numbers</span>
                <span>target</span>
                <span>result</span>
              </ExampleRow>
              <ExampleRow>
                <span>[2,7,11,15]</span>
                <span>9</span>
                <span>[0,1]</span>
              </ExampleRow>
              <ExampleRow>
                <span>[3,2,4]</span>
                <span>6</span>
                <span>[1,2]</span>
              </ExampleRow>
            </ExampleTable>
          </div>
          <Hint>말하면 힌트를 요청하세요. 힌트를 쓰면 점수에서 5점이 차감됩니다.</Hint>
        </ProblemPanel>

        <EditorPanel>
          <EditorHeader>solution.py</EditorHeader>
          <EditorBody>
            <LineNumbers>
              {lines.map((n) => (
                <div key={n}>{n}</div>
              ))}
            </LineNumbers>
            <Code>{SOLUTION_CODE}</Code>
          </EditorBody>
          <EditorFooter>
            <Shortcuts>⌘⏎ 제출 · ⌘R 초기화 · ⌘/ 힌트</Shortcuts>
            <SubmitButton onClick={() => navigate('/code/result')}>제출</SubmitButton>
          </EditorFooter>
        </EditorPanel>
      </Grid>
    </Page>
  )
}
