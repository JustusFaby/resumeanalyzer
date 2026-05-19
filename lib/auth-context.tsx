'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser, handleCognitoCallback, isAuthenticated, logoutFromCognito } from './auth'

interface AuthUser {
  id: string
  email?: string
  name?: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await handleCognitoCallback()
      } catch (_error) {
        // Ignore auth errors on load; user stays unauthenticated.
      } finally {
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: isAuthenticated(),
      isLoading: loading,
      logout: logoutFromCognito,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
