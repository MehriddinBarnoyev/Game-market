'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'

interface Message {
  _id: string
  senderId: string
  recipientId: string
  content: string
  createdAt: string
}

export function Messaging({ recipientId }: { recipientId: string }) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [recipientId])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?recipientId=${recipientId}`)
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
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId, content: newMessage }),
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

  return (
    <Card className="w-full max-w-md bg-gray-800 text-white">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`p-2 rounded ${
                message.senderId === session?.user.id ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
              } max-w-[70%]`}
            >
              {message.content}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={sendMessage} className="flex w-full">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow mr-2 bg-gray-700 text-white border-gray-600"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

