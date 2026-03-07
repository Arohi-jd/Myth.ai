import { FormEvent, useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from './components/Navbar'
import Particles from './components/Particles'
import ChatPage from './pages/ChatPage'
import DevaCards from './pages/DevaCards'
import KathaMandal from './pages/KathaMandal'
import GitaPath from './pages/GitaPath'
import Bookmarks from './pages/Bookmarks'
import './App.css'

type Mode = 'login' | 'signup'
type Page = 'chat' | 'deva' | 'katha' | 'gita' | 'bookmarks'

function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '/api', [])

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [activePage, setActivePage] = useState<Page>('chat')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = mode === 'signup' ? { email, password, name } : { email, password }

      const response = await fetch(`${apiBase}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Authentication failed')
      }

      // Handle email confirmation required (signup without auto-login)
      if (data.emailConfirmationRequired) {
        setMessage(data.message || 'Please check your email to confirm your account')
        return
      }

      const accessToken = data?.session?.access_token || ''
      
      if (!accessToken && mode === 'signup') {
        // Signup succeeded but no session (email confirmation required)
        setMessage(data.message || 'Signup successful! Please check your email to confirm your account.')
        return
      }
      
      if (!accessToken) {
        throw new Error('No access token received')
      }
      
      setToken(accessToken)
      setUserEmail(data?.user?.email || email)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setToken('')
    setUserEmail('')
    setMessage('')
    setEmail('')
    setPassword('')
    setName('')
    setActivePage('chat')
  }

  function renderPage() {
    switch (activePage) {
      case 'chat':
        return <ChatPage token={token} />
      case 'deva':
        return <DevaCards />
      case 'katha':
        return <KathaMandal />
      case 'gita':
        return <GitaPath />
      case 'bookmarks':
        return <Bookmarks />
      default:
        return <ChatPage token={token} />
    }
  }

  // ── Authenticated view ──
  if (token) {
    return (
      <div className="app-shell">
        <Particles />
        <Navbar
          activePage={activePage}
          onNavigate={setActivePage}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
        {renderPage()}
      </div>
    )
  }

  // ── Auth page ──
  return (
    <div className="auth-page">
      <Particles />

      <div className="auth-card">
        {/* Chakra emblem */}
        <div className="auth-emblem">
          <svg viewBox="0 0 80 80" className="auth-chakra-svg">
            <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45 * Math.PI) / 180
              return (
                <line
                  key={i}
                  x1={40 + 14 * Math.cos(angle)}
                  y1={40 + 14 * Math.sin(angle)}
                  x2={40 + 30 * Math.cos(angle)}
                  y2={40 + 30 * Math.sin(angle)}
                  stroke="currentColor"
                  strokeWidth="0.8"
                  opacity="0.25"
                />
              )
            })}
          </svg>
        </div>

        <h1 className="auth-title">Myth.ai</h1>
        <p className="auth-subtitle">Gateway to Ancient Wisdom</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setMessage('') }}
          >
            Enter
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setMessage('') }}
          >
            Begin Journey
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-field">
              <input
                placeholder="Your name, seeker"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-field">
            <input
              type="email"
              placeholder="Sacred email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field auth-password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Secret mantra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword
                ? <EyeOff size={16} strokeWidth={1.5} />
                : <Eye size={16} strokeWidth={1.5} />}
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <span className="auth-loading">
                <span className="auth-spinner" />
                Channeling...
              </span>
            ) : (
              mode === 'login' ? 'Open the Gates' : 'Embark'
            )}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-footer">
          {mode === 'login'
            ? 'First time, seeker? '
            : 'Already initiated? '}
          <button
            type="button"
            className="auth-switch"
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}
          >
            {mode === 'login' ? 'Begin your journey' : 'Enter the sanctum'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
