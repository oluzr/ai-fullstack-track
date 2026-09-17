import { useEffect, useState } from 'react'
import { api } from '../api'

export default function MeaningModal({
  term,
  onCancel,
  onConfirm,
}: {
  term: string
  onCancel: () => void
  onConfirm: (definition: string) => void
}) {
  const [loading, setLoading] = useState(true)
  const [isAmbiguous, setIsAmbiguous] = useState(false)
  const [meanings, setMeanings] = useState<string[]>([])
  const [seenMeanings, setSeenMeanings] = useState<string[]>([])
  const [selected, setSelected] = useState('')

  const fetchMeanings = async (exclude: string[]) => {
    setLoading(true)
    try {
      const res = await api.interpretTerm(term, exclude)
      setIsAmbiguous(res.is_ambiguous)
      setMeanings(res.meanings)
      setSelected(res.meanings[0] ?? '')
      setSeenMeanings((prev) => [...prev, ...res.meanings])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMeanings([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term])

  return (
    <div className="modal-overlay">
      <div className="modal meaning-modal">
        <h3>&quot;{term}&quot; 의미 확인</h3>

        {loading && <p className="muted">의미를 확인하는 중...</p>}

        {!loading && isAmbiguous && (
          <>
            <p className="muted">여러 의미로 쓰일 수 있는 단어예요. 등록할 의미를 골라주세요.</p>
            <div className="choices">
              {meanings.map((m, i) => (
                <label key={i} className="choice">
                  <input
                    type="radio"
                    name="meaning"
                    checked={selected === m}
                    onChange={() => setSelected(m)}
                  />
                  <span>
                    <strong>{i + 1}번 의미.</strong> {m}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        {!loading && !isAmbiguous && meanings[0] && (
          <p className="single-meaning">{meanings[0]}</p>
        )}

        {!loading && (
          <div className="modal-actions">
            {!isAmbiguous && (
              <button className="secondary" onClick={() => fetchMeanings(seenMeanings)}>
                다른 의미로 다시 추론
              </button>
            )}
            <button onClick={() => onConfirm(selected)} disabled={!selected}>
              이 의미로 등록
            </button>
            <button className="secondary" onClick={onCancel}>
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
