"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/login")
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin()) {
    return null
  }

  return <>{children}</>
}

