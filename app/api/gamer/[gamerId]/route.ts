import { NextResponse } from 'next/server'

const mockGamerProfiles = [
  { id: 'default-gamer-id', username: 'CoolGamer123', avatar: '/avatars/gamer1.jpg', status: 'online' },
  { id: 'gamer2', username: 'ProPlayer', avatar: '/avatars/gamer2.jpg', status: 'offline' },
  { id: 'gamer3', username: 'GameMaster', avatar: '/avatars/gamer3.jpg', status: 'online' },
]

export async function GET(request: Request, { params }: { params: { gamerId: string } }) {
  const gamerId = params.gamerId

  const gamerProfile = mockGamerProfiles.find(gamer => gamer.id === gamerId)

  if (gamerProfile) {
    return NextResponse.json(gamerProfile)
  } else {
    return NextResponse.json({ error: 'Gamer not found' }, { status: 404 })
  }
}

