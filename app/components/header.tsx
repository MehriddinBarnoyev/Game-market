'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, User, Search, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()

  useEffect(() => {
    setCartCount(getCartCount())
  }, [getCartCount])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-black">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white mr-4">
            Game Market
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 mx-4 max-w-md hidden sm:flex">
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white border-gray-700"
          />
          <Button type="submit" variant="secondary" className="ml-2">
            <Search className="h-5 w-5" />
          </Button>
        </form>
        <nav className="flex items-center space-x-4">
          <Link href="/search" className="text-gray-300 hover:text-white sm:hidden">
            <Search className="h-5 w-5" />
          </Link>
          {user && (
            <>
              <Link href="/chats" className="text-gray-300 hover:text-white relative">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={() => router.push('/profile')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-gray-300 hover:text-white">
                Logout
              </Button>
            </>
          )}
          {!user && (
            <Button variant="ghost" onClick={() => router.push('/login')} className="text-gray-300 hover:text-white">
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}

