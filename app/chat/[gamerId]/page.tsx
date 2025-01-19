'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatArea } from '@/components/ChatArea'
import { GamerLoader } from '@/app/components/gamer-loader'

interface GamerProfile {
  id: string
  username: string
  avatar: string
  status: 'online' | 'offline'
}

export default function GamerChatPage() {
  const { gamerId } = useParams()
  const [gamerProfile, setGamerProfile] = useState<GamerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGamerProfile = async () => {
      try {
        const response = await fetch(`/api/gamer/${gamerId}`)
        if (response.ok) {
          const data = await response.json()
          setGamerProfile(data)
        }
      } catch (error) {
        console.error('Error fetching gamer profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamerProfile()
  }, [gamerId])

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
      <Card className="bg-black mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={gamerProfile.avatar} alt={gamerProfile.username} />
              <AvatarFallback>{gamerProfile.username[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl">{gamerProfile.username}</h2>
              <p className={`text-sm ${gamerProfile.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                {gamerProfile.status}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <ChatArea chatId={gamerId} />
    </div>
  )
}

