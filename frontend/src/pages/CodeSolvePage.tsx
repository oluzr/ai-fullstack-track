import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import ThinkingDots from '../components/ThinkingDots'
import { flashAiPhase } from '../store/useAiActivityStore'
import { Muted } from '../styles/shared'
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
  CodeInput,
  EditorFooter,
  SubmitButton,
} from './CodeSolvePage.styles'

const LANGUAGES = [
  { id: 'python', label: 'python', ext: 'py' },
  { id: 'ts', label: 'ts', ext: 'ts' },
  { id: 'go', label: 'go', ext: 'go' },
] as const

export default function CodeSolvePage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]['id']>('python')
  const [code, setCode] = useState('')

  const { data: problems } = useQuery({
    queryKey: ['code-problems'],
    queryFn: api.listCodeProblems,
  })
  const problemId = problems?.[0]?.id
  const { data: problem, isLoading } = useQuery({
    queryKey: ['code-problem', problemId],
    queryFn: () => api.getCodeProblem(problemId!),
    enabled: problemId !== undefined,
  })

  const submit = useMutation({
    mutationFn: () => api.submitCode(problem!.id, language, code),
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: (result) => {
      flashAiPhase('done')
      navigate('/code/result', {
        state: { result, problemTitle: problem!.title, language },
      })
    },
    onError: () => flashAiPhase('error'),
  })

  if (isLoading || !problem)
    return (
      <Page>
        <TopBar>
          <TopBarTitle>
            불러오는 중 <ThinkingDots />
          </TopBarTitle>
        </TopBar>
      </Page>
    )

  const lines = code.split('\n')
  const activeLang = LANGUAGES.find((l) => l.id === language)!

  return (
    <Page>
      <TopBar>
        <TopBarTitle>
          문제 풀기 <strong>/ {problem.title}</strong> <em>[{problem.difficulty}]</em>
        </TopBarTitle>
        <LangTabs>
          {LANGUAGES.map((l) => (
            <LangTab key={l.id} $active={l.id === language} onClick={() => setLanguage(l.id)}>
              {l.label}
            </LangTab>
          ))}
        </LangTabs>
      </TopBar>

      <Grid>
        <ProblemPanel>
          <div>
            <ProblemTitle>{problem.title}</ProblemTitle>
            <ProblemBody>{problem.prompt}</ProblemBody>
          </div>
          <div>
            <SubLabel>제약사항</SubLabel>
            <Constraints>
              {problem.constraints.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </Constraints>
          </div>
          <div>
            <SubLabel>입출력 예</SubLabel>
            <ExampleTable>
              <ExampleRow $header>
                <span>input</span>
                <span>output</span>
              </ExampleRow>
              {problem.examples.map((ex, i) => (
                <ExampleRow key={i}>
                  <span>{ex.input}</span>
                  <span>{ex.output}</span>
                </ExampleRow>
              ))}
            </ExampleTable>
          </div>
          <Hint>힌트 요청 기능은 아직 준비 중입니다.</Hint>
        </ProblemPanel>

        <EditorPanel>
          <EditorHeader>solution.{activeLang.ext}</EditorHeader>
          <EditorBody>
            <LineNumbers>
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </LineNumbers>
            <CodeInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="여기에 코드를 작성하세요"
              spellCheck={false}
            />
          </EditorBody>
          <EditorFooter>
            {submit.isPending ? (
              <Muted>
                LLM이 코드를 검토하는 중 <ThinkingDots />
              </Muted>
            ) : (
              <span />
            )}
            <SubmitButton onClick={() => submit.mutate()} disabled={!code.trim() || submit.isPending}>
              제출
            </SubmitButton>
          </EditorFooter>
        </EditorPanel>
      </Grid>
    </Page>
  )
}
