import { FormEvent, useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Navbar from './components/Navbar'
import ChatPage from './pages/ChatPage'
import DevaCards from './pages/DevaCards'
import KathaMandal from './pages/KathaMandal'
import GitaPath from './pages/GitaPath'
import Bookmarks from './pages/Bookmarks'
import { supabase } from './lib/supabase'
import './App.css'

type Mode = 'login' | 'signup'

const TOKEN_STORAGE_KEY = 'mythai_token'
const REFRESH_TOKEN_STORAGE_KEY = 'mythai_refresh_token'
const EMAIL_STORAGE_KEY = 'mythai_user_email'

function getStoredValue(key: string) {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(key) || ''
}

function App() {
  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '/api', [])

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(() => getStoredValue(TOKEN_STORAGE_KEY))
  const [userEmail, setUserEmail] = useState(() => getStoredValue(EMAIL_STORAGE_KEY))
  const [showPassword, setShowPassword] = useState(false)

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

      const loggedInUserEmail = data?.user?.email || email
      const refreshToken = data?.session?.refresh_token || ''
      setToken(accessToken)
      setUserEmail(loggedInUserEmail)
      window.localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
      window.localStorage.setItem(EMAIL_STORAGE_KEY, loggedInUserEmail)
      if (refreshToken) {
        window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
      }
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
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(EMAIL_STORAGE_KEY)
    setMessage('')
    setEmail('')
    setPassword('')
    setName('')
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      })
      if (error) throw error
      // Supabase will redirect to Google — we don't reach here
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Google sign-in failed')
      setLoading(false)
    }
  }

  // Handle OAuth callback — Supabase puts tokens in the URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || !hash.includes('access_token')) return

    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token') || ''
    const refreshToken = params.get('refresh_token') || ''

    if (accessToken) {
      // Clean the URL
      window.history.replaceState(null, '', window.location.pathname)

      // Fetch user info from the token
      supabase.auth.getUser(accessToken).then(({ data, error }) => {
        if (error || !data.user) {
          setMessage('Failed to verify Google login')
          return
        }

        const loggedInEmail = data.user.email || ''
        setToken(accessToken)
        setUserEmail(loggedInEmail)
        window.localStorage.setItem(TOKEN_STORAGE_KEY, accessToken)
        window.localStorage.setItem(EMAIL_STORAGE_KEY, loggedInEmail)
        if (refreshToken) {
          window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
        }

        // Sync user profile to our backend
        fetch(`${apiBase}/auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ access_token: accessToken }),
        }).catch(() => { /* profile sync is best-effort */ })
      })
    }
  }, [])

  // Listen for auth events from authFetch utility
  // (auto-refresh succeeded → sync state, or refresh failed → force logout)
  useEffect(() => {
    const onLogout = () => handleLogout()
    const onRefreshed = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.token) setToken(detail.token)
    }
    window.addEventListener('auth-logout', onLogout)
    window.addEventListener('auth-token-refreshed', onRefreshed)
    return () => {
      window.removeEventListener('auth-logout', onLogout)
      window.removeEventListener('auth-token-refreshed', onRefreshed)
    }
  })

  // ── Authenticated view ──
  if (token) {
    return (
      <Router>
        <div className="app-shell">
          <Navbar
            userEmail={userEmail}
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage token={token} />} />
            <Route path="/deva-cards" element={<DevaCards />} />
            <Route path="/katha-mandal" element={<KathaMandal />} />
            <Route path="/gita-path" element={<GitaPath token={token} />} />
            <Route path="/bookmarks" element={<Bookmarks token={token} />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </div>
      </Router>
    )
  }

  // ── Auth page ──
  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo emblem */}
        <div className="auth-emblem">
          <img 
            src="/images/logo.png" 
            alt="Myth.ai Logo" 
            className="auth-logo-img"
            width="64"
            height="64"
          />
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

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-signin-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

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
