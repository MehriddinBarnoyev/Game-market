'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function TopUpPage() {
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { user, updateBalance } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const topUpAmount = parseFloat(amount)
    if (!isNaN(topUpAmount)) {
      updateBalance(topUpAmount)
    }

    setIsProcessing(false)
    router.push('/profile')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto bg-black text-white border-gray-700 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Пополнение баланса</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Сумма пополнения"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="bg-gray-900 border-gray-600 text-white"
              />
              <Input
                type="text"
                placeholder="Номер карты"
                required
                className="bg-gray-900 border-gray-600 text-white"
              />
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="MM/YY"
                  required
                  className="bg-gray-900 border-gray-600 text-white"
                />
                <Input
                  type="text"
                  placeholder="CVC"
                  required
                  className="bg-gray-900 border-gray-600 text-white"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-slate-200" 
            onClick={handleSubmit}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : (
              "Пополнить"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

