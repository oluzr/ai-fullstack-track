import { useState } from 'react'
import { api, type Concept, type Quiz, type QuizAnswerResult, type QuizType } from '../api'
import GaugeBar from './GaugeBar'
import NotesPanel from './NotesPanel'

export default function ConceptDetail({
  concept,
  onBack,
  onMastered,
}: {
  concept: Concept
  onBack: () => void
  onMastered: () => void
}) {
  const [gauge, setGauge] = useState(concept.mastery_gauge)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [selectedChoice, setSelectedChoice] = useState('')
  const [freeAnswer, setFreeAnswer] = useState('')
  const [result, setResult] = useState<QuizAnswerResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showMasteryModal, setShowMasteryModal] = useState(false)

  const startQuiz = async (type: QuizType) => {
    setLoading(true)
    setResult(null)
    setSelectedChoice('')
    setFreeAnswer('')
    try {
      setQuiz(await api.createQuiz(concept.id, type))
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!quiz) return
    const userAnswer = quiz.type === 'mc' ? selectedChoice : freeAnswer
    if (!userAnswer.trim()) return

    setLoading(true)
    try {
      const res = await api.answerQuiz(concept.id, quiz.question, userAnswer)
      setResult(res)
      setGauge(res.mastery_gauge)
      if (res.mastery_ready) setShowMasteryModal(true)
    } finally {
      setLoading(false)
    }
  }

  const confirmMaster = async () => {
    await api.masterConcept(concept.id)
    setShowMasteryModal(false)
    onMastered()
  }

  return (
    <div>
      <button className="back-button" onClick={onBack}>
        &larr; 목록으로
      </button>
      <h1>{concept.term}</h1>
      <p className="definition">{concept.definition}</p>
      <GaugeBar value={gauge} />

      <section>
        <h2>퀴즈</h2>
        {!quiz && (
          <div className="quiz-buttons">
            <button onClick={() => startQuiz('mc')} disabled={loading}>
              객관식 문제
            </button>
            <button onClick={() => startQuiz('free')} disabled={loading}>
              서술형 문제
            </button>
          </div>
        )}

        {quiz && (
          <div className="quiz-area">
            <p>{quiz.question}</p>

            {quiz.type === 'mc' && quiz.choices && !result && (
              <div className="choices">
                {quiz.choices.map((choice) => (
                  <label key={choice} className="choice">
                    <input
                      type="radio"
                      name="choice"
                      value={choice}
                      checked={selectedChoice === choice}
                      onChange={() => setSelectedChoice(choice)}
                    />
                    {choice}
                  </label>
                ))}
              </div>
            )}

            {quiz.type === 'free' && !result && (
              <textarea
                value={freeAnswer}
                onChange={(e) => setFreeAnswer(e.target.value)}
                placeholder="개념을 직접 서술해보세요"
                rows={4}
              />
            )}

            {!result && (
              <button onClick={submitAnswer} disabled={loading}>
                제출
              </button>
            )}

            {result && (
              <div className="quiz-result">
                {result.is_correct !== null && (
                  <p>{result.is_correct ? '정답입니다! (+25%p)' : '오답입니다.'}</p>
                )}
                {result.score !== null && (
                  <p>
                    점수: {result.score}점 — {result.feedback}
                  </p>
                )}
                <button
                  onClick={() => {
                    setQuiz(null)
                    setResult(null)
                  }}
                >
                  다른 문제 풀기
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <NotesPanel conceptId={concept.id} />

      {showMasteryModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>이해도 100%에 도달했습니다. 사전에서 제외하시겠어요?</p>
            <div className="modal-actions">
              <button onClick={confirmMaster}>제외하기</button>
              <button onClick={() => setShowMasteryModal(false)}>나중에</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
