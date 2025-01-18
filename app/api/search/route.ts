import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await axios.get('https://www.freetogame.com/api/games')
    const games = response.data

    const filteredGames = games.filter((game: any) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json(filteredGames)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}

