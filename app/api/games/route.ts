import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://www.freetogame.com/api/games', { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error('Failed to fetch games')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

