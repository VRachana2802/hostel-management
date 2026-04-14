import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, UserRole } from '../types'
import { mockUsers } from '../lib/mockData'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ error?: string }>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hostel_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, _password: string): Promise<{ error?: string }> => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    
    const found = mockUsers.find(u => u.email === email)
    if (found) {
      setUser(found)
      localStorage.setItem('hostel_user', JSON.stringify(found))
      setLoading(false)
      return {}
    }
    setLoading(false)
    return { error: 'Invalid email or password' }
  }, [])

  const signup = useCallback(async (
    name: string, email: string, _password: string, role: UserRole
  ): Promise<{ error?: string }> => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))

    const exists = mockUsers.find(u => u.email === email)
    if (exists) {
      setLoading(false)
      return { error: 'Email already registered' }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      created_at: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    setUser(newUser)
    localStorage.setItem('hostel_user', JSON.stringify(newUser))
    setLoading(false)
    return {}
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('hostel_user')
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates }
      setUser(updated)
      localStorage.setItem('hostel_user', JSON.stringify(updated))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
