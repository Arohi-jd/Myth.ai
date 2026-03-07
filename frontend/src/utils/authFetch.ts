/**
 * Authenticated fetch wrapper with automatic JWT token refresh.
 *
 * When a request returns 401 (expired token), this utility:
 *  1. Calls the /auth/refresh endpoint using the stored refresh_token
 *  2. Updates both tokens in localStorage
 *  3. Retries the original request with the fresh access_token
 *  4. If refresh fails, dispatches an 'auth-logout' event so the app logs out
 */

const TOKEN_KEY = 'mythai_token'
const REFRESH_TOKEN_KEY = 'mythai_refresh_token'

const apiBase = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  return '/api'
}

// Prevent multiple concurrent refresh attempts
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) return null

  try {
    const response = await fetch(`${apiBase()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      console.error('Token refresh failed with status:', response.status)
      return null
    }

    const data = await response.json()
    const newAccessToken = data?.session?.access_token
    const newRefreshToken = data?.session?.refresh_token

    if (!newAccessToken) return null

    // Persist the new tokens
    localStorage.setItem(TOKEN_KEY, newAccessToken)
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
    }

    // Notify App.tsx so React state stays in sync
    window.dispatchEvent(new CustomEvent('auth-token-refreshed', { detail: { token: newAccessToken } }))

    return newAccessToken
  } catch (err) {
    console.error('Token refresh error:', err)
    return null
  }
}

/**
 * Drop-in replacement for `fetch()` that auto-injects the auth header
 * and retries once on a 401 after refreshing the token.
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY)

  const headers = new Headers(options.headers || {})
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status !== 401) return response

  // 401 → try to refresh the token (deduplicated)
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }

  const freshToken = await refreshPromise

  if (!freshToken) {
    // Refresh failed → force logout
    window.dispatchEvent(new Event('auth-logout'))
    return response // return original 401
  }

  // Retry the original request with the new token
  const retryHeaders = new Headers(options.headers || {})
  retryHeaders.set('Authorization', `Bearer ${freshToken}`)

  return fetch(url, { ...options, headers: retryHeaders })
}
