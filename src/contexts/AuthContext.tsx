import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import apiClient from '../api/client'
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types'

const handleApiError = (error: any): string => {
  if (!error) return 'Error'
  if (error.response && error.response.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    if (data.message) return data.message
    if (data.error) return data.error
  }
  if (error.message) return error.message
  return String(error)
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: LoginRequest) => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setToken(token)
      setUser(user)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  const register = async (userData: RegisterRequest) => {
    try {
      await apiClient.post('/auth/register', userData)
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}