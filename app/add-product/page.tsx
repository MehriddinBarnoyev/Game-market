"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function AddGamePage() {
  const [formData, setFormData] = useState({
    game_name: "",
    description: "",
    play_game: "",
    release_date: "",
    image: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a game",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("https://6794f90baad755a134eae279.mockapi.io/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          owner_id: user.id,
          images: [formData.image],
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Game added successfully",
        })
        router.push("/profile")
      } else {
        throw new Error("Failed to add game")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add game",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-2xl mx-auto py-8"
    >
      <Card className="bg-black rounded-2xl border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Add New Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game_name">Game Name</Label>
              <Input
                id="game_name"
                value={formData.game_name}
                onChange={(e) => setFormData({ ...formData, game_name: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="play_game">Play Game URL</Label>
              <Input
                id="play_game"
                value={formData.play_game}
                onChange={(e) => setFormData({ ...formData, play_game: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release_date">Release Date</Label>
              <Input
                id="release_date"
                type="date"
                value={formData.release_date}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Game...
                </>
              ) : (
                "Add Game"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

