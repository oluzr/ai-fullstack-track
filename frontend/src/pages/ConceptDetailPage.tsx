import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { api, type Quiz, type QuizAnswerResult, type QuizType } from '../api'
import GaugeBar from '../components/GaugeBar'
import NotesPanel from '../components/NotesPanel'
import { useConcepts } from '../hooks/useConcepts'
import {
  Button,
  Choices,
  ChoiceLabel,
  GlassCard,
  Modal,
  ModalActions,
  ModalOverlay,
  Muted,
  Textarea,
} from '../styles/shared'

const Page = styled.div`
  padding: 34px 40px 48px;
  display: flex;
  flex-direction: column;
  gap: 26px;
  max-width: 720px;
`

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  background: none;
  border: none;
  color: ${(p) => p.theme.color.acc};
  font-size: 13.5px;
  cursor: pointer;
  padding: 0;
`

const TitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Term = styled.h1`
  font-size: 30px;
  font-weight: 800;
  color: ${(p) => p.theme.color.ink};
  letter-spacing: -0.02em;
`

const Definition = styled.p`
  font-size: 14.5px;
  line-height: 1.8;
  color: ${(p) => p.theme.color.ink3};
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${(p) => p.theme.color.ink};
`

const QuizButtons = styled.div`
  display: flex;
  gap: 10px;
`

const QuizCard = styled(GlassCard)`
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Question = styled.p`
  font-size: 15.5px;
  color: ${(p) => p.theme.color.ink};
`

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const Donut = styled.div<{ $pct: number }>`
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 50%;
  background: conic-gradient(
    ${(p) => p.theme.color.acc} 0% ${(p) => p.$pct}%,
    ${(p) => p.theme.border.track} ${(p) => p.$pct}% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`

const DonutInner = styled.div`
  width: 40px;
  height: 40px;
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

const ResultVerdict = styled.span<{ $correct?: boolean }>`
  font-size: 17px;
  font-weight: 800;
  color: ${(p) => (p.$correct === false ? p.theme.color.error : p.theme.color.acc)};
`

const ResultDetail = styled.span`
  font-size: 13.5px;
  color: ${(p) => p.theme.color.ink3};
`

export default function ConceptDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: concepts = [], isLoading } = useConcepts()
  const concept = concepts.find((c) => c.id === Number(id))

  const [gauge, setGauge] = useState<number | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [freeAnswer, setFreeAnswer] = useState('')
  const [result, setResult] = useState<QuizAnswerResult | null>(null)
  const [showMasteryModal, setShowMasteryModal] = useState(false)

  const createQuiz = useMutation({
    mutationFn: (type: QuizType) => api.createQuiz(concept!.id, type),
    onSuccess: (data) => {
      setResult(null)
      setSelectedChoice('')
      setFreeAnswer('')
      setQuiz(data)
    },
  })

  const answerQuiz = useMutation({
    mutationFn: (userAnswer: string) => {
      if (!quiz || !concept) throw new Error('진행 중인 퀴즈가 없습니다')
      return api.answerQuiz(concept.id, quiz.question, userAnswer)
    },
    onSuccess: (res) => {
      setResult(res)
      setGauge(res.mastery_gauge)
      if (res.mastery_ready) setShowMasteryModal(true)
    },
  })

  const masterConcept = useMutation({
    mutationFn: () => api.masterConcept(concept!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      setShowMasteryModal(false)
      navigate('/concepts')
    },
  })

  if (isLoading) return <Page>불러오는 중...</Page>
  if (!concept) return <Page>존재하지 않는 개념입니다.</Page>

  const currentGauge = gauge ?? concept.mastery_gauge

  const submitAnswer = () => {
    if (!quiz) return
    const userAnswer = quiz.type === 'mc' ? selectedChoice : freeAnswer
    if (!userAnswer.trim()) return
    answerQuiz.mutate(userAnswer)
  }

  return (
    <Page>
      <BackLink onClick={() => navigate('/concepts')}>
        <FiArrowLeft /> 목록으로
      </BackLink>

      <TitleRow>
        <Term>{concept.term}</Term>
        <Definition>{concept.definition}</Definition>
        <GaugeBar value={currentGauge} />
      </TitleRow>

      <Section>
        <SectionTitle>퀴즈</SectionTitle>
        {!quiz && (
          <QuizButtons>
            <Button onClick={() => createQuiz.mutate('mc')} disabled={createQuiz.isPending}>
              객관식 문제
            </Button>
            <Button $variant="secondary" onClick={() => createQuiz.mutate('free')} disabled={createQuiz.isPending}>
              서술형 문제
            </Button>
          </QuizButtons>
        )}

        {quiz && (
          <QuizCard>
            <Question>{quiz.question}</Question>

            {quiz.type === 'mc' && quiz.choices && !result && (
              <Choices>
                {quiz.choices.map((choice) => (
                  <ChoiceLabel key={choice}>
                    <input
                      type="radio"
                      name="choice"
                      value={choice}
                      checked={selectedChoice === choice}
                      onChange={() => setSelectedChoice(choice)}
                    />
                    {choice}
                  </ChoiceLabel>
                ))}
              </Choices>
            )}

            {quiz.type === 'free' && !result && (
              <Textarea
                value={freeAnswer}
                onChange={(e) => setFreeAnswer(e.target.value)}
                placeholder="개념을 직접 서술해보세요"
                rows={4}
              />
            )}

            {!result && (
              <Button onClick={submitAnswer} disabled={answerQuiz.isPending}>
                제출
              </Button>
            )}

            {result && (
              <>
                <ResultRow>
                  <Donut $pct={result.score ?? (result.is_correct ? 100 : 0)}>
                    <DonutInner>{result.score ?? (result.is_correct ? 100 : 0)}</DonutInner>
                  </Donut>
                  <ResultText>
                    <ResultVerdict $correct={result.is_correct ?? undefined}>
                      {result.is_correct !== null
                        ? result.is_correct
                          ? '정답'
                          : '오답'
                        : `${result.score}점`}
                    </ResultVerdict>
                    {result.feedback && <ResultDetail>{result.feedback}</ResultDetail>}
                  </ResultText>
                </ResultRow>
                <Button
                  $variant="secondary"
                  onClick={() => {
                    setQuiz(null)
                    setResult(null)
                  }}
                >
                  다른 문제 풀기
                </Button>
              </>
            )}
          </QuizCard>
        )}
      </Section>

      <NotesPanel conceptId={concept.id} />

      {showMasteryModal && (
        <ModalOverlay>
          <Modal>
            <Muted>이해도 100%에 도달했습니다. 사전에서 제외하시겠어요?</Muted>
            <ModalActions>
              <Button $variant="secondary" onClick={() => setShowMasteryModal(false)}>
                나중에
              </Button>
              <Button onClick={() => masterConcept.mutate()} disabled={masterConcept.isPending}>
                제외하기
              </Button>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </Page>
  )
}
