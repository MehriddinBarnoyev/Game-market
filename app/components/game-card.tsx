'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useCart } from '../contexts/CartContext'
import { Check, ShoppingCart, Star } from 'lucide-react'

interface GameCardProps {
  id: number
  title: string
  thumbnail: string
  price: number
  originalPrice?: number
  category: string
  rating: number
}

export function GameCard({ id, title, thumbnail, price, originalPrice, category, rating }: GameCardProps) {
  const router = useRouter()
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleClick = () => {
    router.push(`/game/${id}`)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart({ id, title, price, quantity: 1, thumbnail })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
  }

  return (
    <Card className="bg-black border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={thumbnail}
            alt={title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
              -{discount}%
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">{title}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-400 font-semibold">{category}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-400 ml-1">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-900">
        <div className="flex items-center gap-2">
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">{originalPrice}₽</span>
          )}
          <span className="text-lg font-bold text-white">{price}₽</span>
        </div>
        <Button 
          size="sm" 
          onClick={handleAddToCart}
          className={`transition-all  text-white duration-300 ${isAdded ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2 " />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2 " />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

