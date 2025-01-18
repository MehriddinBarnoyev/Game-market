import { getItem, setItem } from '@/utils/serverStorage'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, description, price, type, gameId, image } = await request.json()
    
    const components = getItem('gameComponents') || []
    const newComponent = {
      id: Date.now().toString(),
      name,
      description,
      price,
      type,
      gameId,
      image,
      createdAt: new Date().toISOString(),
    }

    components.push(newComponent)
    setItem('gameComponents', components)

    return NextResponse.json({ message: 'Component created successfully', component: newComponent }, { status: 201 })
  } catch (error) {
    console.error('Error creating game component:', error)
    return NextResponse.json({ error: 'An error occurred while creating the game component' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    const components = getItem('gameComponents') || []
    const filteredComponents = gameId 
      ? components.filter(c => c.gameId === gameId)
      : components

    return NextResponse.json(filteredComponents)
  } catch (error) {
    console.error('Error fetching game components:', error)
    return NextResponse.json({ error: 'An error occurred while fetching game components' }, { status: 500 })
  }
}

