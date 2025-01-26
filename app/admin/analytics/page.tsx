"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

interface AnalyticsData {
  date: string
  users: number
  games: number
  revenue: number
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call to fetch analytics data
    const fetchData = () => {
      const mockData: AnalyticsData[] = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        users: Math.floor(Math.random() * 100) + 50,
        games: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 10000) + 1000,
      }))
      setData(mockData)
      setLoading(false)
    }

    setTimeout(fetchData, 1000) // Simulate network delay
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-100">Analytics</h1>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#60A5FA" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle>Game Additions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="games" stroke="#34D399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="date" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

