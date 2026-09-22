import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, GlassCard } from '../styles/shared'

const Page = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
`

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Meta = styled.div`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 12px;
  color: ${(p) => p.theme.color.ink3};
`

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.025em;
`

const Donut = styled.div`
  width: 104px;
  height: 104px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(#25cfa0 0% 88%, ${(p) => p.theme.border.track} 88% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`

const DonutInner = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: ${(p) => p.theme.surface.solid};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Score = styled.span`
  font-size: 27px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

const ScoreMax = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 10px;
  color: ${(p) => p.theme.color.ink3};
`

const GaugeRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const GaugeLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${(p) => p.theme.color.ink3};
`

const GaugeTrack = styled.div`
  height: 8px;
  background: ${(p) => p.theme.border.line};
  border-radius: ${(p) => p.theme.radius.pill};
  overflow: hidden;
  display: flex;
`

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FeedbackCard = styled(GlassCard)<{ $highlight?: boolean }>`
  padding: 15px 18px;
  display: flex;
  gap: 14px;
  ${(p) => p.$highlight && `border-color: rgba(37,207,160,0.35);`}
`

const FeedbackLabel = styled.span`
  font-family: ${(p) => p.theme.font.mono};
  font-size: 11.5px;
  color: ${(p) => p.theme.color.acc};
  padding-top: 2px;
  white-space: nowrap;
`

const FeedbackText = styled.span`
  font-size: 14px;
  line-height: 1.7;
  color: ${(p) => p.theme.color.ink2};
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

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
