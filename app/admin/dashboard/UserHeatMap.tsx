"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface User {
  id: string
  username: string
  balance: number
}

interface UserHeatMapProps {
  users: User[]
}

export function UserHeatMap({ users }: UserHeatMapProps) {
  const [maxBalance, setMaxBalance] = useState(0)

  useEffect(() => {
    const max = Math.max(...users.map((user) => user.balance))
    setMaxBalance(max)
  }, [users])

  const getColor = (balance: number) => {
    const ratio = balance / maxBalance
    const hue = ((1 - ratio) * 120).toString(10)
    return `hsl(${hue}, 100%, 50%)`
  }

  return (
    <div className="grid grid-cols-10 gap-1">
      {users.map((user) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundColor: getColor(user.balance) }}
          className="w-full h-10 rounded relative group"
          whileHover={{ scale: 1.1 }}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute inset-0 bg-black bg-opacity-75 text-white p-2 rounded text-xs overflow-hidden">
            {user.username}: ${user.balance.toFixed(2)}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

