"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { GamerLoader } from "@/app/components/gamer-loader"

interface GamerProfile {
  id: string
  username: string
  avatar: string
  status: "online" | "offline"
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
}

export default function GamerChatPage() {
  const { gamerId } = useParams()
  const [gamerProfile, setGamerProfile] = useState<GamerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchGamerProfile = async () => {
      try {
        const response = await fetch(`/api/gamer/${gamerId}`)
        if (response.ok) {
          const data = await response.json()
          setGamerProfile(data)
        }
      } catch (error) {
        console.error("Error fetching gamer profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamerProfile()
  }, [gamerId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: "user",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate a delay before the game creator responds
    setTimeout(() => {
      const creatorMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "creator",
        content: "Thank you for your message! I'll get back to you as soon as possible.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, creatorMessage])
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <GamerLoader />
      </div>
    )
  }

  if (!gamerProfile) {
    return <div className="text-center text-2xl mt-8 text-white">Gamer not found</div>
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <Card className="bg-black border-gray-700 rounded-2xl mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={gamerProfile.avatar} alt={gamerProfile.username} />
              <AvatarFallback>{gamerProfile.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl">{gamerProfile.username}</h2>
              <p className={`text-sm ${gamerProfile.status === "online" ? "text-green-500" : "text-gray-400"}`}>
                {gamerProfile.status}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-black border-gray-700 rounded-2xl">
        <CardContent className="p-4">
          <div className="h-[calc(100vh-300px)] overflow-y-auto mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 ${message.senderId === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block max-w-[70%] p-3 rounded-lg ${
                    message.senderId === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow bg-gray-700 border-gray-600 text-white"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

