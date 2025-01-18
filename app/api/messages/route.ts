import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

let messages: any[] = [
  {
    id: '1',
    chatId: '1',
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '/avatars/system.jpg',
    content: 'Welcome to your chat with Alice!',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    chatId: '2',
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '/avatars/system.jpg',
    content: 'Welcome to your chat with Bob!',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    chatId: '3',
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '/avatars/system.jpg',
    content: 'Welcome to your chat with Charlie!',
    timestamp: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chatId = searchParams.get('chatId')

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
  }

  const filteredMessages = messages.filter(m => m.chatId === chatId)

  return NextResponse.json(filteredMessages)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { chatId, content, senderId, senderName, senderAvatar } = await request.json()

  if (!chatId || !content || !senderId || !senderName) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
  }

  const newMessage = {
    id: Date.now().toString(),
    chatId,
    senderId,
    senderName,
    senderAvatar,
    content,
    timestamp: new Date().toISOString(),
  }

  messages.push(newMessage)

  return NextResponse.json(newMessage, { status: 201 })
}

