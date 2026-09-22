import { useNavigate } from 'react-router-dom'
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
  GaugeRow,
  GaugeLabel,
  GaugeTrack,
  FeedbackList,
  FeedbackCard,
  FeedbackLabel,
  FeedbackText,
  Actions,
} from './CodeResultPage.styles'

export default function CodeResultPage() {
  const navigate = useNavigate()

  return (
    <Page>
      <Card>
        <Header>
          <HeaderText>
            <Meta>두 수의 합 · Python · 03:12 (목업 화면)</Meta>
            <Title>통과했습니다</Title>
          </HeaderText>
          <Donut>
            <DonutInner>
              <Score>88</Score>
              <ScoreMax>/100</ScoreMax>
            </DonutInner>
          </Donut>
        </Header>

        <GaugeRow>
          <GaugeLabel>
            <span>이해도</span>
            <span>52% → 70%</span>
          </GaugeLabel>
          <GaugeTrack>
            <div style={{ width: '52%', background: '#0f9b7e' }} />
            <div style={{ width: '18%', background: '#7fe3c4' }} />
          </GaugeTrack>
        </GaugeRow>

        <FeedbackList>
          <FeedbackCard>
            <FeedbackLabel>정확성</FeedbackLabel>
            <FeedbackText>테스트케이스 12/12 통과.</FeedbackText>
          </FeedbackCard>
          <FeedbackCard>
            <FeedbackLabel>복잡도</FeedbackLabel>
            <FeedbackText>O(n) 한 번 순회. 정렬 후 투 포인터보다 정리한 선택입니다.</FeedbackText>
          </FeedbackCard>
          <FeedbackCard $highlight>
            <FeedbackLabel>보완</FeedbackLabel>
            <FeedbackText>짝을 찾지 못했을 때의 반환이 암묵적입니다. 명시하는 편이 안전합니다.</FeedbackText>
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
