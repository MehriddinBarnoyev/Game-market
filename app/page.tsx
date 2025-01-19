'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { GameCard } from './components/game-card'
import { CategorySidebar } from './components/category-sidebar'
import { GamerLoader } from './components/gamer-loader'

interface Game {
  id: number
  title: string
  thumbnail: string
  genre: string
  platform: string
  game_url: string
  short_description: string
}

function generatePrice() {
  const basePrice = Math.floor(Math.random() * 2000) + 99
  const hasDiscount = Math.random() > 0.5
  const discountedPrice = hasDiscount 
    ? Math.floor(basePrice * (0.6 + Math.random() * 0.3))
    : basePrice
  return {
    price: discountedPrice,
    originalPrice: hasDiscount ? basePrice : undefined
  }
}

const GAMES_PER_PAGE = 20

function HomePageContent() {
  const [games, setGames] = useState<Game[]>([])
  const [displayedGames, setDisplayedGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loader = useRef(null)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  const fetchGames = useCallback(async () => {
    try {
      const response = await axios.get('/api/games')
      setGames(response.data)
      const uniqueCategories = Array.from(new Set(response.data.map((game: Game) => game.genre)))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching games:', error)
      setError('Failed to load games. Please try again later.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const filterGames = useCallback(() => {
    return games.filter(game => 
      (!selectedCategory || game.genre === selectedCategory) &&
      (game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       game.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [games, selectedCategory, searchQuery])

  useEffect(() => {
    const filteredGames = filterGames()
    setDisplayedGames(filteredGames.slice(0, page * GAMES_PER_PAGE))
    setHasMore(filteredGames.length > page * GAMES_PER_PAGE)
  }, [games, selectedCategory, searchQuery, page, filterGames])

  const loadMoreGames = useCallback(() => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1)
    }
  }, [hasMore])

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore) {
      loadMoreGames()
    }
  }, [hasMore, loadMoreGames])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    }
    const observer = new IntersectionObserver(handleObserver, option)
    if (loader.current) observer.observe(loader.current)
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [handleObserver])

  if (loading) {
    return <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center items-center"><GamerLoader /></div>
  }

  if (error) {
    return <div className="min-h-screen bg-black text-white p-4 md:p-8 flex justify-center items-center">{error}</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={category => {
            setSelectedCategory(category)
            setPage(1)
          }}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedGames.map((game: Game) => {
              const { price, originalPrice } = generatePrice()
              const rating = 3 + Math.random() * 2 // Random rating between 3 and 5
              
              return (
                <GameCard
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  thumbnail={game.thumbnail}
                  price={price}
                  originalPrice={originalPrice}
                  category={game.genre}
                  rating={rating}
                />
              )
            })}
          </div>
          {hasMore && (
            <div ref={loader} className="flex justify-center mt-8">
              <GamerLoader />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  )
}

