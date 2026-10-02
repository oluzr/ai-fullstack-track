import { useLocation, useNavigate } from 'react-router-dom'
import type { CodeSubmitResult } from '../types'
import { Button } from '../styles/shared'
import {
  Page,
  Card,
  Header,
  HeaderText,
  Meta,
  Title,
  Donut,
  DonutInner,
  Score,
  ScoreMax,
  FeedbackList,
  FeedbackCard,
  FeedbackLabel,
  FeedbackText,
  Actions,
} from './CodeResultPage.styles'

type LocationState = {
  result: CodeSubmitResult
  problemTitle: string
  language: string
}

export default function CodeResultPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const data = state as LocationState | null

  if (!data)
    return (
      <Page>
        <Card>
          <Title>결과가 없습니다</Title>
          <Button onClick={() => navigate('/code/solve')}>문제 풀러 가기</Button>
        </Card>
      </Page>
    )

  const { result, problemTitle, language } = data

  return (
    <Page>
      <Card>
        <Header>
          <HeaderText>
            <Meta>
              {problemTitle} · {language} · LLM 리뷰 (실제 실행 결과 아님)
            </Meta>
            <Title>{result.passed ? '통과했습니다' : '아직 부족합니다'}</Title>
          </HeaderText>
          <Donut $pct={result.score}>
            <DonutInner>
              <Score>{result.score}</Score>
              <ScoreMax>/100</ScoreMax>
            </DonutInner>
          </Donut>
        </Header>

        <FeedbackList>
          <FeedbackCard>
            <FeedbackLabel>정확성</FeedbackLabel>
            <FeedbackText>{result.feedback.correctness}</FeedbackText>
          </FeedbackCard>
          <FeedbackCard>
            <FeedbackLabel>복잡도</FeedbackLabel>
            <FeedbackText>{result.feedback.complexity}</FeedbackText>
          </FeedbackCard>
          <FeedbackCard $highlight>
            <FeedbackLabel>보완</FeedbackLabel>
            <FeedbackText>{result.feedback.improvement}</FeedbackText>
          </FeedbackCard>
        </FeedbackList>

        <Actions>
          <Button onClick={() => navigate('/code/solve')}>다음 문제</Button>
          <Button $variant="secondary" disabled>
            모범 답안
          </Button>
          <Button $variant="secondary" disabled>
            메모로 저장
          </Button>
        </Actions>
      </Card>
    </Page>
  )
}
