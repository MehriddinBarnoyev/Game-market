import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // In a real application, you would fetch this data from your database
  const mockUsers = [
    { id: '1', username: 'Alice', email: 'alice@example.com' },
    { id: '2', username: 'Bob', email: 'bob@example.com' },
    { id: '3', username: 'Charlie', email: 'charlie@example.com' },
    { id: '4', username: 'David', email: 'david@example.com' },
  ]

  // Filter out the current user
  const filteredUsers = mockUsers.filter(user => user.id !== session.user.id)

  return NextResponse.json(filteredUsers)
}

