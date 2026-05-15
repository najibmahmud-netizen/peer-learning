/**
 * Session Management Utility
 * Handles user sessions, tokens, and local storage
 */

const SESSION_KEY = 'moringa_session'
const TOKEN_KEY = 'moringa_token'
const USER_KEY = 'moringa_user'

/**
 * Create and store a session
 */
export const createSession = (user, token = null) => {
  const session = {
    user,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: token ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  }

  return session
}

/**
 * Get current session
 */
export const getSession = () => {
  try {
    const session = localStorage.getItem(SESSION_KEY)
    return session ? JSON.parse(session) : null
  } catch (error) {
    console.error('Failed to parse session:', error)
    return null
  }
}

/**
 * Get session token
 */
export const getSessionToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Check if session is valid and not expired
 */
export const isSessionValid = () => {
  const session = getSession()
  if (!session) return false

  if (session.expiresAt) {
    const expiryDate = new Date(session.expiresAt)
    return expiryDate > new Date()
  }

  return true
}

/**
 * Clear session
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Refresh session
 */
export const refreshSession = (user, token = null) => {
  clearSession()
  return createSession(user, token)
}

/**
 * Get user from session
 */
export const getSessionUser = () => {
  const session = getSession()
  return session?.user || null
}

/**
 * Add authorization header to fetch requests
 */
export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getSessionToken()
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

/**
 * Authenticated fetch wrapper
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders(options.headers)

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 unauthorized
  if (response.status === 401) {
    clearSession()
    window.location.href = '/login'
  }

  return response
}
