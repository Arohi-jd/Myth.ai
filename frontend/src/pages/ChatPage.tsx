import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, RotateCcw } from 'lucide-react'
import ChakraLoader from '../components/ChakraLoader'
import { authFetch } from '../utils/authFetch'
import './ChatPage.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatPageProps {
  token: string
}

export default function ChatPage({ token: _token }: ChatPageProps) {
  const location = useLocation()
  const apiBase = import.meta.env.VITE_API_URL || '/api'
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendRipple, setSendRipple] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content:
          '**Welcome, O Sadhak of Sanatana Wisdom.**\n\nI am Myth.ai, your guide through the sacred kathas of Bharat — from the Vedas, Upanishads, Ramayana, and Mahabharata to the Puranas.\n\nAsk me about Bhagwan Shiva, Vishnu, Devi, Krishna, Rama, Hanuman, the Devas, Rishis, Avatars, and the timeless path of Dharma and Karma.\n\nWhich divine katha shall we begin today?',
      },
    ])
    
    // Handle pre-filled text from navigation state
    const state = location.state as { prefilledText?: string } | null
    if (state?.prefilledText) {
      setInput(state.prefilledText)
      // Clear the state to prevent re-filling on page refresh
      window.history.replaceState({}, document.title)
    }
  }, [])

  async function handleSend(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || loading) return

    setSendRipple(true)
    setTimeout(() => setSendRipple(false), 600)

    const userMessage: Message = { role: 'user', content: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await authFetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to get response')
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'An unknown disturbance occurred'
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `The ancient channels are disturbed. ${errMsg}. Please try again.` },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function handleClearHistory() {
    await authFetch(`${apiBase}/chat/history`, {
      method: 'DELETE',
    })
    setMessages([
      {
        role: 'assistant',
        content: 'The slate has been cleansed. A new chapter awaits. What wisdom do you seek?',
      },
    ])
  }

  function renderMarkdown(text: string) {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### '))
        return <h4 key={i} className="md-h3">{parseBold(line.slice(4))}</h4>
      if (line.startsWith('## '))
        return <h3 key={i} className="md-h2">{parseBold(line.slice(3))}</h3>
      if (line.startsWith('# '))
        return <h2 key={i} className="md-h1">{parseBold(line.slice(2))}</h2>
      if (line.startsWith('- ') || line.startsWith('* '))
        return <li key={i} className="md-li">{parseBold(line.slice(2))}</li>
      if (line.trim() === '') return <br key={i} />
      return <p key={i} className="md-p">{parseBold(line)}</p>
    })
  }

  function parseBold(text: string) {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>,
    )
  }

  return (
    <div className="chat-page">
      {/* Background chakra */}
      <div className="chat-bg-chakra" />

      {/* Chat header */}
      <div className="chat-header">
        <button onClick={handleClearHistory} className="btn-new-chat" title="Begin new discourse">
          <RotateCcw size={14} strokeWidth={1.5} />
          <span>New Discourse</span>
        </button>
      </div>

      {/* Scrollable messages */}
      <div className="chat-scroll-area">
        <div className={`chat-scroll-inner ${messages.length <= 1 && !loading ? 'centered' : ''}`}>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="avatar-divine">
                    <svg viewBox="0 0 100 100" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="50" cy="50" r="40" strokeOpacity="0.5" />
                      <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.7" stroke="none" />
                      {[0, 60, 120, 180, 240, 300].map((a) => (
                        <line key={a} x1="50" y1="10" x2="50" y2="24" transform={`rotate(${a} 50 50)`} strokeOpacity="0.6" strokeLinecap="round" />
                      ))}
                    </svg>
                  </div>
                )}
                <div className="bubble-content">
                  {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble bubble-assistant">
                <div className="avatar-divine">
                  <svg viewBox="0 0 100 100" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="50" cy="50" r="40" strokeOpacity="0.5" />
                    <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.7" stroke="none" />
                  </svg>
                </div>
                <ChakraLoader />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input bar pinned at bottom */}
      <form className={`chat-input-bar ${sendRipple ? 'ripple' : ''}`} onSubmit={handleSend}>
        <div className="input-stone">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Seek wisdom from the ancient texts..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-send">
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </form>
    </div>
  )
}
