"use client"

import { useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { motion } from "framer-motion"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface User {
  createdAt: string
  balance: number
}

interface UserStatisticsProps {
  users: User[]
}

export function UserStatistics({ users }: UserStatisticsProps) {
  const [timeRange, setTimeRange] = useState("all")

  const filterUsers = (range: string) => {
    const now = new Date()
    switch (range) {
      case "week":
        return users.filter((user) => new Date(user.createdAt) > new Date(now.setDate(now.getDate() - 7)))
      case "month":
        return users.filter((user) => new Date(user.createdAt) > new Date(now.setMonth(now.getMonth() - 1)))
      case "year":
        return users.filter((user) => new Date(user.createdAt) > new Date(now.setFullYear(now.getFullYear() - 1)))
      default:
        return users
    }
  }

  const sortedUsers = filterUsers(timeRange).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const labels = sortedUsers.map((user) => new Date(user.createdAt).toLocaleDateString())
  const balances = sortedUsers.map((user) => user.balance)

  const data = {
    labels,
    datasets: [
      {
        label: "User Balance Over Time",
        data: balances,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "User Balance Trend",
      },
    },
  }

  return (
    <div>
      <div className="mb-4 flex justify-center space-x-2">
        {["week", "month", "year", "all"].map((range) => (
          <motion.button
            key={range}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded ${timeRange === range ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </motion.button>
        ))}
      </div>
      <Line options={options} data={data} />
    </div>
  )
}

