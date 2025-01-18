'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatPreview {
  id: string
  username: string
  avatar: string
  lastMessage: string
  timestamp: string
}

export function ChatList() {
  const [chats, setChats] = useState<ChatPreview[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats')
      if (response.ok) {
        const data = await response.json()
        setChats(data)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  }

  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)]">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
          onClick={() => handleChatSelect(chat.id)}
        >
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{chat.username}</h3>
            <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
          </div>
          <span className="text-xs text-gray-500">{chat.timestamp}</span>
        </div>
      ))}
    </ScrollArea>
  )
}

