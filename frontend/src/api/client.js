const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const STORAGE_KEY = 'auth'

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message)
    this.status = status
    this.code = code
  }
}

const MESSAGES = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_INVALID_CREDENTIALS: 'Incorrect email or password.',
  AUTH_REQUIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to do that.',
  MEMBER_EMAIL_EXISTS: 'This email is already registered.',
  SPACE_NOT_FOUND: 'Space not found.',
  SPACE_INACTIVE: 'This space is not accepting reservations.',
  RESERVATION_NOT_FOUND: 'Reservation not found.',
  RESERVATION_CONFLICT: 'That time overlaps an existing reservation.',
  RESERVATION_NOT_MODIFIABLE: 'This reservation can no longer be changed.',
}

const STATUS_MESSAGES = {
  400: MESSAGES.VALIDATION_ERROR,
  401: MESSAGES.AUTH_REQUIRED,
  403: MESSAGES.ACCESS_DENIED,
  404: 'Not found.',
  409: 'The request conflicts with the current state.',
}

export function readSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function writeSession(session) {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable; session lives only in memory
  }
}

let unauthorizedHandler = null
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn
}

// Server message text is never shown raw; only the error-contract code / HTTP status is mapped.
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = auth ? readSession()?.accessToken : null
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Please try again later.')
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    // empty or non-JSON body
  }

  if (!res.ok) {
    const code = data?.code
    const message =
      MESSAGES[code] ?? STATUS_MESSAGES[res.status] ?? 'Something went wrong. Please try again.'
    if (res.status === 401 && token && code !== 'AUTH_INVALID_CREDENTIALS') {
      unauthorizedHandler?.()
    }
    throw new ApiError(res.status, code ?? null, message)
  }
  return data
}
