"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface GameComponent {
  id: string
  name: string
  type: string
  gameId: string
}

export default function ManageComponents() {
  const [components, setComponents] = useState<GameComponent[]>([])

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const response = await fetch("/api/admin/components")
        const data = await response.json()
        setComponents(data)
      } catch (error) {
        console.error("Error fetching components:", error)
      }
    }

    fetchComponents()
  }, [])

  const handleDeleteComponent = async (componentId: string) => {
    try {
      await fetch(`/api/admin/components/${componentId}`, { method: "DELETE" })
      setComponents(components.filter((component) => component.id !== componentId))
    } catch (error) {
      console.error("Error deleting component:", error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Game Components</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Game ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((component) => (
            <TableRow key={component.id}>
              <TableCell>{component.name}</TableCell>
              <TableCell>{component.type}</TableCell>
              <TableCell>{component.gameId}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteComponent(component.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

