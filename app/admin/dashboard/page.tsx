"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserStatistics } from "./UserStatistics"
import { UserHeatMap } from "./UserHeatMap"
import { fetchUsers } from "@/lib/api"
import { Users, GamepadIcon, Puzzle, DollarSign } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  balance: number
  createdAt: string
}

interface DashboardStats {
  totalUsers: number
  totalGames: number
  totalComponents: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    totalComponents: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await fetchUsers()
        const usersCount = users.length

        const gamesCount = Math.floor(Math.random() * (200 - 50 + 1)) + 50
        const componentsCount = gamesCount + 100 + Math.floor(Math.random() * 100)
        const revenue = Math.floor(Math.random() * 1000000) + 100000

        setStats({
          totalUsers: usersCount,
          totalGames: gamesCount,
          totalComponents: componentsCount,
          totalRevenue: revenue,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl md:text-3xl font-bold text-gray-100"
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-900 to-blue-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-100">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{loading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-blue-200 mt-1">Active accounts on platform</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-purple-900 to-purple-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-100">Total Games</CardTitle>
              <GamepadIcon className="h-4 w-4 text-gray-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{loading ? "..." : stats.totalGames}</div>
              <p className="text-xs text-purple-200 mt-1">Available games in catalog</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-green-900 to-green-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-100">Game Components</CardTitle>
              <Puzzle className="h-4 w-4 text-gray-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{loading ? "..." : stats.totalComponents}</div>
              <p className="text-xs text-green-200 mt-1">Total game components available</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-yellow-900 to-yellow-950">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">
                {loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
              </div>
              <p className="text-xs text-yellow-200 mt-1">Total revenue generated</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <UserStatistics users={[]} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-100">User Balance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <UserHeatMap users={[]} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Recent Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-100">Username</TableHead>
                <TableHead className="text-gray-100">Email</TableHead>
                <TableHead className="text-gray-100">Balance</TableHead>
                <TableHead className="text-gray-100">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-100">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : (
                stats.totalUsers > 0 &&
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>User {index + 1}</TableCell>
                    <TableCell>user{index + 1}@example.com</TableCell>
                    <TableCell>${(Math.random() * 1000).toFixed(2)}</TableCell>
                    <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}

