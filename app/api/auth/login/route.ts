import { NextResponse } from 'next/server'

const API_URL = 'https://676112646be7889dc35fa055.mockapi.io/users'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const response = await fetch(`${API_URL}?email=${email}`)
    const users = await response.json()

    const user = users.find(u => u.email === email && u.password === password)

    if (user) {
      // In a real app, you would create a session or JWT here
      return NextResponse.json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username, email: user.email, role: user.role } 
      })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}

