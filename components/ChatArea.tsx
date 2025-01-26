'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, AlertTriangle } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  senderName: string
  senderAvatar: string
}

interface ChatAreaProps {
  chatId: string
}

export function ChatArea({ chatId }: ChatAreaProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [chatId])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?chatId=${chatId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user || isSending) return

    setIsSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          content: newMessage,
          senderId: session.user.id,
          senderName: session.user.name,
          senderAvatar: session.user.image,
        }),
      })

      if (response.ok) {
        const sentMessage = await response.json()
        setMessages([...messages, sentMessage])
        setNewMessage('')
        
        // Simulate a default response
        setTimeout(() => {
          const defaultResponse = {
            id: Date.now().toString(),
            chatId,
            senderId: 'default-user',
            senderName: 'Default User',
            senderAvatar: '/avatars/default-user.jpg',
            content: 'Thanks for your message. I\'ll get back to you soon!',
            timestamp: new Date().toISOString(),
          }
          setMessages(prev => [...prev, defaultResponse])
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-gray-800 rounded-lg overflow-hidden">
      <div className="bg-yellow-600 text-black p-2 text-center flex items-center justify-center">
        <AlertTriangle className="mr-2" />
        <span>Warning: This is a demo chat. Do not share sensitive information.</span>
      </div>
      <ScrollArea className="flex-1 p-4 bg-black" ref={scrollAreaRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start mb-4 ${
              message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.senderId !== session?.user?.id && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback>{message.senderName[0]}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`p-2  max-w-[70%] ${
                message.senderId === session?.user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className='rounded-2xl'>{message.content} 1</p>
              <p className="text-xs mt-1 opacity-70">{new Date(message.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      <form onSubmit={handleSendMessage} className="border-t border-gray-900 flex">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 mr-2 bg-black text-white border-gray-600"
        />
        <Button type="submit" disabled={isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

