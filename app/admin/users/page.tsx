"use client"

import { useState, useEffect } from "react"
import { fetchUsers } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface User {
  id: string
  username: string
  email: string
  balance: number
  createdAt: string
  isAdmin?: boolean
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const fetchedUsers = await fetchUsers()
        setUsers(fetchedUsers)
        setFilteredUsers(fetchedUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-100">Manage Users</h1>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">User Search</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
          />
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <Card className="bg-black border-gray-700 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-gray-100">User List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-900">
                    <TableHead className="text-gray-300">Username</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">Email</TableHead>
                    <TableHead className="text-gray-300">Balance</TableHead>
                    <TableHead className="text-gray-300 hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-gray-300">Admin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-700">
                      <TableCell className="font-medium text-gray-100">{user.username}</TableCell>
                      <TableCell className="text-gray-300 hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="text-gray-300">${user.balance}</TableCell>
                      <TableCell className="text-gray-300 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">{user.isAdmin ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredUsers.length === 0 && !loading && (
        <p className="text-center mt-4 text-gray-400">No users found matching your search.</p>
      )}
    </div>
  )
}

