import { NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = 'https://676112646be7889dc35fa055.mockapi.io/users'

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()
    
    // Check if user already exists
    const existingUserResponse = await axios.get(`${API_URL}?email=${email}`)
    const existingUsers = existingUserResponse.data
    
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user
    const response = await axios.post(API_URL, {
      username,
      email,
      password,
      role: 'user',
      balance: 0,
    })

    if (response.status !== 201) {
      throw new Error('Failed to create user')
    }

    const newUser = response.data

    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 })
  }
}

