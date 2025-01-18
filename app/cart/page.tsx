'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import Image from 'next/image'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart()
  const router = useRouter()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // Assuming 10% tax
  const total = subtotal + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image src={item.thumbnail} alt={item.title} width={64} height={64} className="object-cover rounded" />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-16 text-center bg-gray-700 border-gray-600"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-end space-y-4">
          <div className="text-right">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
          </div>
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => router.push('/checkout')}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

