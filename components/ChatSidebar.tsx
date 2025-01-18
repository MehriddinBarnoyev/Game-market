'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Chat {
  id: string
  userId: string
  username: string
  lastMessage: string
  timestamp: string
}

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void
}

export function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  const { data: session } = useSession()
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    // Fetch chats from API
    const fetchChats = async () => {
      try {
        const response = await fetch('/api/chats')
        const data = await response.json()
        setChats(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching chats:', error)
        setChats([])
      }
    }

    fetchChats()
  }, [])

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        {Array.isArray(chats) && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => onSelectChat(chat.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${chat.username}`} />
                <AvatarFallback>{chat.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{chat.username}</p>
                <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500">{chat.timestamp}</span>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400">No chats available</div>
        )}
      </ScrollArea>
    </div>
  )
}

