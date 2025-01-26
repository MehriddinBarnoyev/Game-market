"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

type User = {
  id: string
  username: string
  email: string
  role: "user" | "admin"
  balance: number
  avatar?: string
  isAdmin?: boolean
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (username: string, email: string, password: string) => Promise<void>
  updateBalance: (amount: number) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_EMAILS = ["barnoyevmehriddin77@gmail.com"]
const ADMINS_API = "https://676112646be7889dc35fa055.mockapi.io/admins"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [adminEmails, setAdminEmails] = useState<string[]>(ADMIN_EMAILS)
  const router = useRouter()

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get(ADMINS_API)
        const apiAdmins = response.data
        const apiAdminEmails = apiAdmins.map((admin: any) => admin.email)
        setAdminEmails([...ADMIN_EMAILS, ...apiAdminEmails])
      } catch (error) {
        console.error("Error fetching admins:", error)
      }
    }
    fetchAdmins()
  }, [])

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("token")

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser)
      // Check if user is admin based on current admin emails or isAdmin flag
      if (adminEmails.includes(parsedUser.email) || parsedUser.isAdmin) {
        parsedUser.role = "admin"
      }
      setUser(parsedUser)
    }
  }, [adminEmails])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.get("https://676112646be7889dc35fa055.mockapi.io/users")
      const users = response.data
      const foundUser = users.find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        const isAdminUser = adminEmails.includes(email) || foundUser.isAdmin
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          role: isAdminUser ? "admin" : "user",
          balance: foundUser.balance,
          avatar: foundUser.avatar,
          isAdmin: isAdminUser,
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("token", "mock-token")
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/login")
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const isAdminUser = adminEmails.includes(email)
      const response = await axios.post("https://676112646be7889dc35fa055.mockapi.io/users", {
        username,
        email,
        password,
        role: isAdminUser ? "admin" : "user",
        balance: 0,
        avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${username}`,
        isAdmin: isAdminUser,
      })

      const newUser = response.data
      const userData = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: isAdminUser ? "admin" : "user",
        balance: newUser.balance,
        avatar: newUser.avatar,
        isAdmin: isAdminUser,
      }

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", "mock-token")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const updateBalance = async (amount: number) => {
    if (!user) return

    try {
      const updatedBalance = user.balance + amount
      const response = await axios.put(`https://676112646be7889dc35fa055.mockapi.io/users/${user.id}`, {
        ...user,
        balance: updatedBalance,
      })

      const updatedUser = response.data
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating balance:", error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return

    try {
      const response = await axios.put(`https://676112646be7889dc35fa055.mockapi.io/users/${user.id}`, {
        ...user,
        ...data,
      })

      const updatedUser = response.data
      // Preserve admin role if email is in admin list or isAdmin flag is true
      if (adminEmails.includes(updatedUser.email) || updatedUser.isAdmin) {
        updatedUser.role = "admin"
      }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const isAdmin = () => {
    return user?.role === "admin" || user?.isAdmin || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateBalance,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

