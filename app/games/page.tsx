'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchGames } from '@/utils/api'
import { GamerLoader } from '../components/gamer-loader'

interface Game {
  id: number
  title: string
  thumbnail: string
  short_description: string
  genre: string
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadGames() {
      try {
        const fetchedGames = await fetchGames()
        setGames(fetchedGames)
      } catch (err) {
        setError('Failed to load games. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadGames()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <GamerLoader />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-2xl text-red-500 mt-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link href={`/game/${game.id}`} key={game.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 bg-gray-800 text-white">
              <CardHeader>
                <CardTitle className="text-xl">{game.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <img src={game.thumbnail} alt={game.title} className="w-full h-48 object-cover mb-4 rounded" />
                <p className="text-gray-300 mb-2">{game.short_description}</p>
                <p className="text-sm text-gray-400">Genre: {game.genre}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

