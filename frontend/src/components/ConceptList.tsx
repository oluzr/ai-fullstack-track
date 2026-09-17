import { useEffect, useState } from 'react'
import { api, type Concept } from '../api'
import GaugeBar from './GaugeBar'
import MeaningModal from './MeaningModal'

export default function ConceptList({ onSelect }: { onSelect: (c: Concept) => void }) {
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [term, setTerm] = useState('')
  const [interpretingTerm, setInterpretingTerm] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setConcepts(await api.listConcepts())
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = () => {
    const value = term.trim()
    if (!value) return
    setError(null)
    setInterpretingTerm(value)
  }

  const handleConfirmMeaning = async (definition: string) => {
    if (!interpretingTerm) return
    setLoading(true)
    setError(null)
    try {
      await api.createConcept(interpretingTerm, definition)
      setTerm('')
      setInterpretingTerm(null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : '등록에 실패했습니다')
      setInterpretingTerm(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>내 개념 사전</h1>

      <div className="add-form">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="새 개념 등록 (예: 클로저)"
        />
        <button onClick={handleAdd} disabled={loading}>
          등록
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="concept-grid">
        {concepts.map((c) => (
          <div key={c.id} className="concept-card" onClick={() => onSelect(c)}>
            <h3>{c.term}</h3>
            <GaugeBar value={c.mastery_gauge} />
          </div>
        ))}
        {concepts.length === 0 && <p className="muted">아직 등록된 개념이 없습니다.</p>}
      </div>

      {interpretingTerm && (
        <MeaningModal
          term={interpretingTerm}
          onCancel={() => setInterpretingTerm(null)}
          onConfirm={handleConfirmMeaning}
        />
      )}
    </div>
  )
}
