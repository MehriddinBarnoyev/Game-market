'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from 'lucide-react'
import { Chat, Message } from '../types/chat'

interface ChatViewProps {
  chat: Chat;
  messages: Message[];
  onSendMessage: (chatId: number, message: string) => void;
}

const ChatView = ({ chat, messages, onSendMessage }: ChatViewProps) => {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (inputMessage.trim() === '') return

    onSendMessage(chat.id, inputMessage)
    setInputMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-dark">
      <div className="hidden lg:flex items-center gap-3 p-4 border-b border-gray-800">
        <Avatar>
          <AvatarImage src={`https://i.pravatar.cc/100?u=${chat.id}`} />
          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-medium text-white">{chat.name}</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === 0 ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 border-t border-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
          className="flex gap-2"
        >
          <Input
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            placeholder="Введите сообщение..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button type="submit" className='bg-blue-600 hover:bg-blue-700'>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatView

