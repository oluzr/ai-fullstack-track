import { useEffect, useState } from 'react'
import { api, type Note } from '../api'

export default function NotesPanel({ conceptId }: { conceptId: number }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setNotes(await api.listNotes(conceptId))
  }

  useEffect(() => {
    load()
  }, [conceptId])

  const handleAdd = async () => {
    const value = body.trim()
    if (!value) return
    setLoading(true)
    try {
      await api.createNote(conceptId, value)
      setBody('')
      await load()
    } finally {
      setLoading(false)
    }
  }

  const ownNotes = notes.filter((n) => !n.is_backlink)
  const backlinkedNotes = notes.filter((n) => n.is_backlink)

  return (
    <section>
      <h2>메모</h2>
      <div className="note-form">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="메모를 남겨보세요 (다른 등록된 개념을 언급하면 자동으로 연결됩니다)"
          rows={3}
        />
        <button onClick={handleAdd} disabled={loading}>
          메모 추가
        </button>
      </div>

      <div className="notes-section">
        <h3>내가 남긴 메모</h3>
        {ownNotes.length === 0 && <p className="muted">아직 메모가 없습니다.</p>}
        {ownNotes.map((n) => (
          <div key={n.id} className="note-card">
            <p>{n.body}</p>
          </div>
        ))}
      </div>

      <div className="notes-section">
        <h3>다른 메모에서 언급됨</h3>
        {backlinkedNotes.length === 0 && <p className="muted">언급된 메모가 없습니다.</p>}
        {backlinkedNotes.map((n) => (
          <div key={n.id} className="note-card backlink">
            <p className="note-source">{n.concept_term}에 속한 메모</p>
            <p>{n.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
