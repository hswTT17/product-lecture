import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const SUGGESTED = [
  '제휴 마케팅을 처음 시작하려면 어디서부터 시작해야 하나요?',
  '좋은 파트너사를 선정하는 기준이 무엇인가요?',
  '공동 마케팅 캠페인 성과를 측정하는 방법을 알려주세요.',
  '제휴 수수료 구조는 어떻게 설계하나요?',
]

const WELCOME = {
  role: 'assistant',
  content: '안녕하세요! 저는 파트너십 인사이트의 AI 제휴 마케팅 컨설턴트입니다. 제휴 마케팅, 공동 마케팅, 브랜드 협업 등에 대해 궁금한 점을 자유롭게 질문해주세요.',
}

export default function ConsultPage({ dark, setDark }) {
  const [messages, setMessages] = useState([WELCOME])
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const userText = text.trim()
    if (!userText || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userText }])
    setLoading(true)

    // placeholder for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history }),
      })

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: '서버 오류가 발생했습니다.' }))
        throw new Error(error)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const json = JSON.parse(data)
            const chunk = json.choices?.[0]?.delta?.content || ''
            if (chunk) {
              assistantContent += chunk
              setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: assistantContent },
              ])
            }
          } catch {}
        }
      }

      setHistory(prev => [
        ...prev,
        { role: 'user', content: userText },
        { role: 'assistant', content: assistantContent },
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: `오류가 발생했습니다: ${err.message}` },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <Header dark={dark} setDark={setDark} />

      <section className="page-hero">
        <h1>🤖 AI 제휴 마케팅 컨설팅</h1>
        <p>제휴 마케팅 전문 AI에게 파트너십 전략을 바로 물어보세요.</p>
      </section>

      <main className="consult-main">
        <div className="consult-container">

          {messages.length === 1 && (
            <div className="consult-suggestions">
              <p className="suggestions-label">이런 질문은 어떠세요?</p>
              <div className="suggestions-grid">
                {SUGGESTED.map(q => (
                  <button key={q} className="suggestion-chip" onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <span className="bubble-avatar">AI</span>
                )}
                <div className="bubble-content">
                  {msg.content || (
                    <span className="typing-indicator">
                      <span /><span /><span />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chat-input"
              placeholder="제휴 마케팅에 대해 질문하세요..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
              {loading ? (
                <span className="spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}
