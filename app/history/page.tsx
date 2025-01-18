'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { GamerLoader } from '../components/gamer-loader'

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { purchaseHistory } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <GamerLoader />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black text-white">
      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">История покупок</CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length === 0 ? (
            <p>У вас пока нет покупок.</p>
          ) : (
            <div className="space-y-4">
              {purchaseHistory.map((purchase) => (
                <Card key={purchase.id} className="bg-gray-800">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">{new Date(purchase.date).toLocaleString()}</span>
                      <span className="font-bold">{purchase.total} ₽</span>
                    </div>
                    <div className="space-y-2">
                      {purchase.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <img src={item.thumbnail} alt={item.title} className="w-8 h-8 object-cover rounded" />
                          <span className="flex-1">{item.title}</span>
                          <span className="text-sm text-gray-400">{item.quantity} x {item.price} ₽</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

