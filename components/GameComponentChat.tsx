'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  senderName: string
}

interface GameComponentChatProps {
  gameId: string
  componentId: string
}

export function GameComponentChat({ gameId, componentId }: GameComponentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { data: session, status } = useSession()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000) // Poll for new messages every 5 seconds
    return () => clearInterval(interval)
  }, [gameId, componentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?gameId=${gameId}&componentId=${componentId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !session?.user) return

    setLoading(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          componentId,
          content: newMessage,
          senderId: session.user.id,
          senderName: session.user.name,
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to chat.</div>
  }

  return (
    <Card className="w-full bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl">Chat with Creators</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 mb-4 ${
                message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.senderId !== session?.user?.id && (
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.senderName}`} />
                  <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  message.senderId === session?.user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="font-semibold mb-1">{message.senderName}</p>
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              {message.senderId === session?.user?.id && (
                <Avatar>
                  <AvatarImage src={session.user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${session.user.name}`} />
                  <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="flex w-full space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-gray-700 text-white border-gray-600"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

