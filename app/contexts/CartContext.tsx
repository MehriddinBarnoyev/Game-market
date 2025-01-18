'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  thumbnail: string
}

interface PurchaseHistory {
  id: string
  items: CartItem[]
  total: number
  date: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getCartCount: () => number
  getTotalPrice: () => number
  completePurchase: () => Promise<void>
  purchaseHistory: PurchaseHistory[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`)
      const savedPurchaseHistory = localStorage.getItem(`purchaseHistory_${user.id}`)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
      if (savedPurchaseHistory) {
        setPurchaseHistory(JSON.parse(savedPurchaseHistory))
      }
    } else {
      setCartItems([])
      setPurchaseHistory([])
    }
  }, [user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems))
    }
  }, [cartItems, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(`purchaseHistory_${user.id}`, JSON.stringify(purchaseHistory))
    }
  }, [purchaseHistory, user])

  const addToCart = useCallback((item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id)
      if (existingItem) {
        return prevItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevItems, { ...item, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cartItems])

  const completePurchase = useCallback(async () => {
    const total = getTotalPrice()
    const newPurchase: PurchaseHistory = {
      id: Date.now().toString(),
      items: [...cartItems],
      total,
      date: new Date().toISOString()
    }
    setPurchaseHistory(prev => [newPurchase, ...prev])
    clearCart() // Clear the cart after completing the purchase
  }, [cartItems, getTotalPrice, clearCart])

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartCount, 
      getTotalPrice,
      completePurchase,
      purchaseHistory
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

