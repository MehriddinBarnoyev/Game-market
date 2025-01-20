"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "../contexts/AuthContext"

export default function AddProduct() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a product",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    if (image) {
      formData.append("image", image)
    }
    formData.append("userId", user.id)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "Product added successfully",
        })
        router.push("/profile")
      } else {
        throw new Error("Failed to add product")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-gray-800 text-white"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="bg-gray-800 text-white"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="bg-gray-800 text-white"
          />
        </div>
        <div>
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="bg-gray-800 text-white"
          />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  )
}

