import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

// dev: vite가 /chat, /health를 backend로 직접 프록시
// prod: nginx가 /api/* 를 backend로 리버스 프록시
const API_BASE = import.meta.env.DEV ? '' : '/api'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply ?? '' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '오류가 발생했습니다.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>AI Chat Skeleton</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          minHeight: 300,
          padding: '1rem',
          marginBottom: '1rem',
          background: '#fff',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '0.5rem 0' }}>
            <strong>{m.role === 'user' ? '나' : '에이전트'}:</strong> {m.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? '...' : '전송'}
        </button>
      </div>
    </div>
  )
}

export default App
