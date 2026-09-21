import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { GlassCard, glass } from '../styles/shared'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const TopBar = styled.div`
  padding: 16px 28px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  background: ${(p) => p.theme.surface.glass2};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${glass(34)}
`

const TopBarTitle = styled.span`
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

const LangTabs = styled.div`
  display: flex;
  gap: 7px;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
`

const LangTab = styled.span<{ $active?: boolean }>`
  padding: 6px 12px;
  border-radius: ${(p) => p.theme.radius.xs};
  background: ${(p) => (p.$active ? p.theme.color.btn : p.theme.border.bd1)};
  color: ${(p) => (p.$active ? '#fff' : p.theme.color.ink3)};
`

const Grid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
  padding: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const ProblemPanel = styled(GlassCard)`
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

const ProblemTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

const ProblemBody = styled.div`
  font-size: 14.5px;
  line-height: 1.8;
  color: ${(p) => p.theme.color.ink3};
`

const SubLabel = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: ${(p) => p.theme.color.ink3};
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`

const Constraints = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12.5px;
  line-height: 1.95;
  color: ${(p) => p.theme.color.ink3};
`

const ExampleTable = styled.div`
  background: ${(p) => p.theme.surface.glass6};
  border: 1px solid ${(p) => p.theme.border.bd2};
  border-radius: ${(p) => p.theme.radius.sm};
  overflow: hidden;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
`

const ExampleRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 1.4fr 0.6fr 0.9fr;
  padding: 9px 14px;
  background: ${(p) => (p.$header ? p.theme.border.seg : 'transparent')};
  color: ${(p) => (p.$header ? p.theme.color.ink3 : p.theme.color.ink2)};
  border-top: ${(p) => (p.$header ? 'none' : `1px solid ${p.theme.border.fieldbd}`)};
`

const Hint = styled.div`
  margin-top: auto;
  font-size: 13px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink3};
`

const EditorPanel = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.surface.code};
  border: 1px solid ${(p) => p.theme.border.bd1};
  border-radius: ${(p) => p.theme.radius.lg};
  overflow: hidden;
  ${glass(26)}
`

const EditorHeader = styled.div`
  padding: 11px 20px;
  border-bottom: 1px solid ${(p) => p.theme.border.bd1};
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11px;
  color: #8ea3bd;
`

const EditorBody = styled.div`
  flex: 1;
  display: flex;
  font-family: ${(p) => p.theme.font.mono};
  font-size: 13.5px;
  line-height: 1.9;
`

const LineNumbers = styled.div`
  padding: 18px 12px 18px 20px;
  color: #4a5c74;
  text-align: right;
  user-select: none;
`

const Code = styled.pre`
  margin: 0;
  padding: 18px 20px 18px 8px;
  color: #e2ecf7;
  flex: 1;
`

const EditorFooter = styled.div`
  padding: 14px 20px;
  border-top: 1px solid ${(p) => p.theme.border.bd1};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Shortcuts = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: #7e92ab;
`

const SubmitButton = styled.button`
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
