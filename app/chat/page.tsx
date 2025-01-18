'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChatList } from '@/components/ChatList'
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'
import { ChatArea } from '@/components/ChatArea'

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/3 border-r border-gray-800">
        <div className="p-4 bg-yellow-600 text-black flex items-center">
          <AlertTriangle className="mr-2" />
          <span>Demo: Chat functionality is limited</span>
        </div>
        <ChatList />
      </div>
      <div className="flex-1">
        {selectedChat ? (
          <ChatArea chatId={selectedChat} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

