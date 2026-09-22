import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { api, type Quiz, type QuizAnswerResult, type QuizType } from '../api'
import GaugeBar from '../components/GaugeBar'
import NotesPanel from '../components/NotesPanel'
import { useConcepts } from '../hooks/useConcepts'
import { flashAiPhase } from '../store/useAiActivityStore'
import {
  Button,
  Choices,
  ChoiceLabel,
  Modal,
  ModalActions,
  ModalOverlay,
  Muted,
  Textarea,
} from '../styles/shared'
import {
  Page,
  BackLink,
  TitleRow,
  Term,
  Definition,
  ExplainRow,
  ExplainCard,
  Section,
  SectionTitle,
  QuizButtons,
  QuizCard,
  Question,
  ResultRow,
  Donut,
  DonutInner,
  ResultText,
  ResultVerdict,
  ResultDetail,
} from './ConceptDetailPage.styles'

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
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: (data) => {
      flashAiPhase('done')
      setResult(null)
      setSelectedChoice('')
      setFreeAnswer('')
      setQuiz(data)
    },
    onError: () => flashAiPhase('error'),
  })

  const answerQuiz = useMutation({
    mutationFn: (userAnswer: string) => {
      if (!quiz || !concept) throw new Error('진행 중인 퀴즈가 없습니다')
      return api.answerQuiz(concept.id, quiz.question, userAnswer)
    },
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: (res) => {
      flashAiPhase('done')
      setResult(res)
      setGauge(res.mastery_gauge)
      if (res.mastery_ready) setShowMasteryModal(true)
    },
    onError: () => flashAiPhase('error'),
  })

  const masterConcept = useMutation({
    mutationFn: () => api.masterConcept(concept!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      setShowMasteryModal(false)
      navigate('/concepts')
    },
  })

  const explain = useMutation({
    mutationFn: () => api.explainConcept(concept!.id),
    onMutate: () => flashAiPhase('thinking'),
    onSuccess: () => flashAiPhase('done'),
    onError: () => flashAiPhase('error'),
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

        <ExplainRow>
          <Button $variant="secondary" onClick={() => explain.mutate()} disabled={explain.isPending}>
            <FiBookOpen /> {explain.data ? '다시 설명해줘' : '더 쉽게 설명해줘'}
          </Button>
        </ExplainRow>
        {explain.isPending && <Muted>설명 만드는 중...</Muted>}
        {explain.data && <ExplainCard>{explain.data.explanation}</ExplainCard>}
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
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && setShowMasteryModal(false)}>
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
