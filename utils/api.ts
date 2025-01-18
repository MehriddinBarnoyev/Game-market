const GAMES_API_URL = 'https://www.freetogame.com/api/games'
const USERS_API_URL = 'https://676112646be7889dc35fa055.mockapi.io/users'

export async function fetchGames() {
  const response = await fetch(GAMES_API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch games: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

export async function fetchGameById(id: string) {
  const response = await fetch(`https://www.freetogame.com/api/game?id=${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch game: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  if (!data || Object.keys(data).length === 0) {
    throw new Error('Game not found')
  }
  return data
}

export async function registerUser(userData: { username: string; email: string; password: string }) {
  const response = await fetch(USERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  if (!response.ok) {
    throw new Error('Failed to register user')
  }
  return response.json()
}

export async function loginUser(credentials: { email: string; password: string }) {
  const response = await fetch(`${USERS_API_URL}?email=${credentials.email}`)
  if (!response.ok) {
    throw new Error('Failed to login')
  }
  const users = await response.json()
  const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password)
  if (!user) {
    throw new Error('Invalid credentials')
  }
  return user
}

