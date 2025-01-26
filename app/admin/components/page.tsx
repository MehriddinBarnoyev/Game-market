"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search, Trash2, Edit } from "lucide-react"

interface GameComponent {
  id: string
  name: string
  description: string
  type: string
  price: number
  gameId: string
  createdAt: string
}

export default function ComponentsPage() {
  const [components, setComponents] = useState<GameComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [newComponent, setNewComponent] = useState({
    name: "",
    description: "",
    type: "item",
    price: 0,
    gameId: "",
  })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      const response = await fetch("/api/game-components")
      if (response.ok) {
        const data = await response.json()
        setComponents(data)
      }
    } catch (error) {
      console.error("Error fetching components:", error)
      toast({
        title: "Error",
        description: "Failed to fetch components",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const response = await fetch("/api/game-components", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComponent),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Component created successfully",
        })
        fetchComponents()
        setNewComponent({
          name: "",
          description: "",
          type: "item",
          price: 0,
          gameId: "",
        })
      } else {
        throw new Error("Failed to create component")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create component",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteComponent = async (id: string) => {
    try {
      const response = await fetch(`/api/game-components/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setComponents(components.filter((component) => component.id !== id))
        toast({
          title: "Success",
          description: "Component deleted successfully",
        })
      } else {
        throw new Error("Failed to delete component")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete component",
        variant: "destructive",
      })
    }
  }

  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold text-white">Game Components</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>Create New Component</DialogTitle>
              <DialogDescription>Add a new game component to the system</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateComponent}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newComponent.description}
                    onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newComponent.type}
                    onValueChange={(value) => setNewComponent({ ...newComponent, type: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="item">Item</SelectItem>
                      <SelectItem value="weapon">Weapon</SelectItem>
                      <SelectItem value="armor">Armor</SelectItem>
                      <SelectItem value="consumable">Consumable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newComponent.price}
                    onChange={(e) => setNewComponent({ ...newComponent, price: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label htmlFor="gameId">Game ID</Label>
                  <Input
                    id="gameId"
                    value={newComponent.gameId}
                    onChange={(e) => setNewComponent({ ...newComponent, gameId: e.target.value })}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button type="submit" disabled={isCreating} className="bg-purple-600 hover:bg-purple-700">
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Component"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle>Search Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-gray-800">
        <CardHeader>
          <CardTitle>Component List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Game ID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComponents.map((component) => (
                    <TableRow key={component.id} className="border-gray-800">
                      <TableCell>{component.name}</TableCell>
                      <TableCell>{component.type}</TableCell>
                      <TableCell>${component.price}</TableCell>
                      <TableCell>{component.gameId}</TableCell>
                      <TableCell>{new Date(component.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/components/edit/${component.id}`)}
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteComponent(component.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

