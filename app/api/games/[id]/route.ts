import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const response = await axios.get(`https://www.freetogame.com/api/game?id=${id}`)
    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Error fetching game:', error)
    return NextResponse.json({ error: 'Failed to fetch game' }, { status: 500 })
  }
}

