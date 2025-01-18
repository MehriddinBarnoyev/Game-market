import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

const API_URL = 'https://676112646be7889dc35fa055.mockapi.io/users'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await axios.get(`${API_URL}?email=${credentials.email}`)
          const users = response.data
          const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password)

          if (user) {
            return {
              id: user.id,
              name: user.username,
              email: user.email,
              role: user.role,
            }
          } else {
            return null
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }

