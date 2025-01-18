'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

type User = {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
  balance: number
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
  updateBalance: (amount: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.get('https://676112646be7889dc35fa055.mockapi.io/users')
      const users = response.data
      const foundUser = users.find((u: User) => u.email === email)
      
      if (foundUser) {
        const userWithBalance = { ...foundUser, balance: foundUser.balance || 0 }
        setUser(userWithBalance)
        localStorage.setItem('user', JSON.stringify(userWithBalance))
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('https://676112646be7889dc35fa055.mockapi.io/users', {
        username,
        email,
        password,
        role: 'user',
        balance: 0
      })
      const newUser = response.data
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

