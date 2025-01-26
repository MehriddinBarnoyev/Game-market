"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user || !isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, isAdmin, router, toast])

  if (!user || !isAdmin()) {
    return null
  }

  return <>{children}</>
}

