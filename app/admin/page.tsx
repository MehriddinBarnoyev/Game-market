"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GamepadIcon, Puzzle } from "lucide-react"
import { fetchUsers } from "@/lib/api"

interface DashboardStats {
  totalUsers: number
  totalGames: number
  totalComponents: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    totalComponents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real users count
        const users = await fetchUsers()
        const usersCount = users.length

        // Generate random game count between 50-200
        const gamesCount = Math.floor(Math.random() * (200 - 50 + 1)) + 50

        // Generate components count (100+ more than games)
        const componentsCount = gamesCount + 100 + Math.floor(Math.random() * 100)

        setStats({
          totalUsers: usersCount,
          totalGames: gamesCount,
          totalComponents: componentsCount,
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
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold">
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
          <Card className="bg-gray-900 border-gray-700 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Users</CardTitle>
              <Users className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.totalUsers}</div>
              <p className="text-xs text-blue-100 mt-1">Active accounts on platform</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <Card className="bg-gray-900 border-gray-700 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Total Games</CardTitle>
              <GamepadIcon className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.totalGames}</div>
              <p className="text-xs text-purple-100 mt-1">Available games in catalog</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
          <Card className="bg-gray-900 border-gray-700 rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white">Game Components</CardTitle>
              <Puzzle className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{loading ? "..." : stats.totalComponents}</div>
              <p className="text-xs text-green-100 mt-1">Total game components</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

