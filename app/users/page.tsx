'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  username: string
  email: string
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const startChat = async (userId: string) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (response.ok) {
        const { chatId } = await response.json()
        router.push(`/chat?id=${chatId}`)
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-gray-800 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <Button onClick={() => startChat(user.id)}>Chat</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

