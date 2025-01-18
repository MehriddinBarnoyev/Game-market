'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

interface CategorySidebarProps {
  categories: string[]
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategorySidebar({ categories, selectedCategory, onSelectCategory }: CategorySidebarProps) {
  const CategoryList = () => (
    <ScrollArea className="h-[calc(100vh-5rem)] bg-black">
      <div className="space-y-2 p-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => onSelectCategory(null)}
        >
          All Games
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <>
      {/* Mobile: Sheet (Drawer) */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle category menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-black p-0">
          <div className="p-4 bg-black">
            <h2 className="text-xl font-bold text-white">Categories</h2>
          </div>
          <CategoryList />
        </SheetContent>
      </Sheet>

      {/* Desktop: Sidebar */}
      <div className="hidden md:block w-64 bg-gray-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <div className="p-4 bg-black">
          <h2 className="text-xl font-bold text-white">Categories</h2>
        </div>
        <CategoryList />
      </div>
    </>
  )
}

