'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { GamerLoader } from '../components/gamer-loader'

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { cartItems, getTotalPrice, completePurchase, clearCart } = useCart()
  const { user, updateBalance } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    const total = getTotalPrice()

    if (user && user.balance >= total) {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      await completePurchase()
      updateBalance(-total)
      clearCart() // Clear the cart after successful purchase
      setIsProcessing(false)
      router.push('/history') // Redirect to the new history page
    } else {
      alert('Недостаточно средств на балансе')
      setIsProcessing(false)
    }
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <Card className="max-w-md mx-auto bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Оформление заказа</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span>{item.quantity} x {item.price} ₽</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full flex justify-between mb-4">
            <span>Итого:</span>
            <span className="font-bold">{getTotalPrice()} ₽</span>
          </div>
          <div className="w-full flex justify-between mb-4">
            <span>Ваш баланс:</span>
            <span className="font-bold">{user.balance} ₽</span>
          </div>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={handleSubmit}
            disabled={isProcessing || user.balance < getTotalPrice()}
          >
            {isProcessing ? (
              <GamerLoader />
            ) : (
              'Оплатить'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

