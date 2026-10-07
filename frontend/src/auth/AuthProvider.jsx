import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/endpoints.js'
import { readSession, setUnauthorizedHandler, writeSession } from '../api/client.js'
import { AuthContext } from './authContext.js'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const logout = useCallback(() => {
    writeSession(null)
    setSession(null)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    const next = { accessToken: data.accessToken, member: data.member }
    writeSession(next)
    setSession(next)
    return data.member
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo(
    () => ({ member: session?.member ?? null, isAuthenticated: !!session, login, logout }),
    [session, login, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
