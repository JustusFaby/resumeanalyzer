const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID
const COGNITO_SCOPES = 'openid email profile'

function base64UrlEncode(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBase64Url(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  return atob(padded)
}

function parseJwt(token: string) {
  try {
    const payload = token.split('.')[1]
    const json = decodeBase64Url(payload)
    return JSON.parse(json)
  } catch (_error) {
    return null
  }
}

function getStoredTokens() {
  return {
    idToken: localStorage.getItem('idToken') || '',
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }
}

function storeTokens(tokens: { id_token?: string; access_token?: string; refresh_token?: string }) {
  if (tokens.id_token) {
    localStorage.setItem('idToken', tokens.id_token)
  }
  if (tokens.access_token) {
    localStorage.setItem('accessToken', tokens.access_token)
  }
  if (tokens.refresh_token) {
    localStorage.setItem('refreshToken', tokens.refresh_token)
  }
}

function clearTokens() {
  localStorage.removeItem('idToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

async function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64UrlEncode(digest)
}

function getRedirectUri() {
  return window.location.origin
}

function getLogoutUri() {
  return window.location.origin
}

export async function loginWithCognito() {
  const redirectUri = getRedirectUri()
  const codeVerifier = await generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  sessionStorage.setItem('pkce_verifier', codeVerifier)

  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    response_type: 'code',
    scope: COGNITO_SCOPES,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  window.location.assign(`${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`)
}

export async function handleCognitoCallback() {
  const redirectUri = getRedirectUri()
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')

  if (!code) {
    return false
  }

  const codeVerifier = sessionStorage.getItem('pkce_verifier')
  if (!codeVerifier) {
    return false
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: COGNITO_CLIENT_ID,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  })

  const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange auth code for tokens.')
  }

  const data = await response.json()
  storeTokens(data)
  sessionStorage.removeItem('pkce_verifier')
  // Redirect to upload page after successful authentication
  window.location.href = '/upload'
  return true
}

export function logoutFromCognito() {
  const logoutUri = getLogoutUri()
  clearTokens()
  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: logoutUri,
  })
  window.location.assign(`${COGNITO_DOMAIN}/logout?${params.toString()}`)
}

export function getIdToken() {
  return getStoredTokens().idToken
}

export function getAuthHeader() {
  const idToken = getIdToken()
  if (!idToken) {
    return {}
  }
  return {
    Authorization: `Bearer ${idToken}`,
  }
}

export function getCurrentUser() {
  const { idToken } = getStoredTokens()
  const payload = idToken ? parseJwt(idToken) : null
  if (!payload) {
    return null
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name || payload.email,
    expiresAt: payload.exp ? payload.exp * 1000 : 0,
  }
}

export function isAuthenticated() {
  const user = getCurrentUser()
  if (!user) {
    return false
  }
  return !user.expiresAt || user.expiresAt > Date.now()
}
