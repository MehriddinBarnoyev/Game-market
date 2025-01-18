import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

const mockChats = [
  { id: '1', username: 'Alice', avatar: '/avatars/alice.jpg', lastMessage: 'Hey, how are you?', timestamp: '2023-06-10T14:30:00Z' },
  { id: '2', username: 'Bob', avatar: '/avatars/bob.jpg', lastMessage: 'Did you see the new update?', timestamp: '2023-06-10T13:45:00Z' },
  { id: '3', username: 'Charlie', avatar: '/avatars/charlie.jpg', lastMessage: 'Let\'s play tonight!', timestamp: '2023-06-10T12:15:00Z' },
]

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json(mockChats)
}

