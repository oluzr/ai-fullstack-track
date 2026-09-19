import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import styled from 'styled-components'
import { api, type Concept, type Quiz, type QuizAnswerResult, type QuizType } from '../api'
import { Button, Choices, ChoiceLabel, Modal, ModalActions, ModalOverlay, Textarea } from '../styles/shared'
import GaugeBar from './GaugeBar'
import NotesPanel from './NotesPanel'

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.primary};
  padding: 0.25rem 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`

const Definition = styled.p`
  color: ${(p) => p.theme.colors.mutedStrong};
  margin-top: 0.25rem;
`

const Section = styled.section`
  margin-top: 2rem;
`

const QuizButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const QuizArea = styled.div`
  background: ${(p) => p.theme.colors.surface};
  border: 1px solid ${(p) => p.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
`

const QuizResult = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${(p) => p.theme.colors.borderLight};
`

export default function ConceptDetail({
  concept,
  onBack,
  onMastered,
}: {
  concept: Concept
  onBack: () => void
  onMastered: () => void
}) {
  const queryClient = useQueryClient()
  const [gauge, setGauge] = useState(concept.mastery_gauge)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [freeAnswer, setFreeAnswer] = useState('')
  const [result, setResult] = useState<QuizAnswerResult | null>(null)
  const [showMasteryModal, setShowMasteryModal] = useState(false)

  const createQuiz = useMutation({
    mutationFn: (type: QuizType) => api.createQuiz(concept.id, type),
    onSuccess: (data) => {
      setResult(null)
      setSelectedChoice('')
      setFreeAnswer('')
      setQuiz(data)
    },
  })

  const answerQuiz = useMutation({
    mutationFn: (userAnswer: string) => {
      if (!quiz) throw new Error('진행 중인 퀴즈가 없습니다')
      return api.answerQuiz(concept.id, quiz.question, userAnswer)
    },
    onSuccess: (res) => {
      setResult(res)
      setGauge(res.mastery_gauge)
      if (res.mastery_ready) setShowMasteryModal(true)
    },
  })

  const masterConcept = useMutation({
    mutationFn: () => api.masterConcept(concept.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concepts'] })
      setShowMasteryModal(false)
      onMastered()
    },
  })

  const submitAnswer = () => {
    if (!quiz) return
    const userAnswer = quiz.type === 'mc' ? selectedChoice : freeAnswer
    if (!userAnswer.trim()) return
    answerQuiz.mutate(userAnswer)
  }

  return (
    <div>
      <BackButton onClick={onBack}>
        <FiArrowLeft /> 목록으로
      </BackButton>
      <h1>{concept.term}</h1>
      <Definition>{concept.definition}</Definition>
      <GaugeBar value={gauge} />

      <Section>
        <h2>퀴즈</h2>
        {!quiz && (
          <QuizButtons>
            <Button onClick={() => createQuiz.mutate('mc')} disabled={createQuiz.isPending}>
              객관식 문제
            </Button>
            <Button onClick={() => createQuiz.mutate('free')} disabled={createQuiz.isPending}>
              서술형 문제
            </Button>
          </QuizButtons>
        )}

        {quiz && (
          <QuizArea>
            <p>{quiz.question}</p>

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
              <QuizResult>
                {result.is_correct !== null && (
                  <p>{result.is_correct ? '정답입니다! (+25%p)' : '오답입니다.'}</p>
                )}
                {result.score !== null && (
                  <p>
                    점수: {result.score}점 — {result.feedback}
                  </p>
                )}
                <Button
                  onClick={() => {
                    setQuiz(null)
                    setResult(null)
                  }}
                >
                  다른 문제 풀기
                </Button>
              </QuizResult>
            )}
          </QuizArea>
        )}
      </Section>

      <NotesPanel conceptId={concept.id} />

      {showMasteryModal && (
        <ModalOverlay>
          <Modal>
            <p>이해도 100%에 도달했습니다. 사전에서 제외하시겠어요?</p>
            <ModalActions>
              <Button onClick={() => masterConcept.mutate()} disabled={masterConcept.isPending}>
                제외하기
              </Button>
              <Button $secondary onClick={() => setShowMasteryModal(false)}>
                나중에
              </Button>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </div>
  )
}
