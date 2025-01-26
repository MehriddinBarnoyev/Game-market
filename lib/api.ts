import axios from "axios"

const USERS_API_URL = "https://676112646be7889dc35fa055.mockapi.io/users"
const ADMINS_API_URL = "https://676112646be7889dc35fa055.mockapi.io/admins"

export async function fetchUsers() {
  try {
    const response = await axios.get(USERS_API_URL)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

export async function fetchAdmins() {
  try {
    const [adminResponse, userResponse] = await Promise.all([axios.get(ADMINS_API_URL), axios.get(USERS_API_URL)])

    const admins = adminResponse.data
    const users = userResponse.data.filter((user: any) => user.isAdmin)
    console.log(users);
    
    const allAdmins = [...admins, ...users]
    return allAdmins.map((admin: any) => ({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role || (admin.isAdmin ? "admin" : "user"),
      balance: admin.balance,
      createdAt: admin.createdAt,
      avatar: admin.avatar,
    }))
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw error
  }
}

