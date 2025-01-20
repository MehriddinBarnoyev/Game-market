import axios from "axios"

const USERS_API_URL = "https://676112646be7889dc35fa055.mockapi.io/users"
const ADMINS_API_URL = "https://676112646be7889dc35fa055.mockapi.io/admins"

export async function fetchUsers(page = 1, limit = 10) {
  try {
    const response = await axios.get(`${USERS_API_URL}?page=${page}&limit=${limit}`)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function fetchAdmins() {
  try {
    const response = await axios.get(ADMINS_API_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw error
  }
}

