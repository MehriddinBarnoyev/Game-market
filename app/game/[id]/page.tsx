'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ChevronLeft, ChevronRight, ShoppingCart, Star, Globe, Calendar, Tag, Play, Heart, Cpu, HardDrive, MessageCircle } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { GamerLoader } from '../../components/gamer-loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { GameComponentChat } from '@/components/GameComponentChat'

interface Game {
  id: number
  title: string
  thumbnail: string
  description: string
  game_url: string
  genre: string
  platform: string
  publisher: string
  developer: string
  release_date: string
  screenshots: { id: number, image: string }[]
  minimum_system_requirements?: {
    os: string
    processor: string
    memory: string
    graphics: string
    storage: string
  }
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

export default function GameDetailPage() {
  const [game, setGame] = useState<Game | null>(null)
  const [relatedGames, setRelatedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [currentScreenshot, setCurrentScreenshot] = useState(0)
  const { id } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const { price, originalPrice } = generatePrice()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`/api/games/${id}`)
        setGame(response.data)
        
        const allGamesResponse = await axios.get('/api/games')
        const relatedGames = allGamesResponse.data
          .filter((g: Game) => g.genre === response.data.genre && g.id !== response.data.id)
          .slice(0, 4)
        setRelatedGames(relatedGames)
      } catch (error) {
        console.error('Error fetching game details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGameDetails()
  }, [id])

  const handleAddToCart = () => {
    if (game) {
      addToCart({ id: game.id, title: game.title, price, quantity: 1, thumbnail: game.thumbnail })
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Here you would typically update the wishlist in your backend
  }

  const handleChatClick = () => {
    // Assuming we have a gamer ID, replace 'gamerId' with the actual ID
    const gamerId = 'default-gamer-id'
    router.push(`/chat/${gamerId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <GamerLoader />
      </div>
    )
  }

  if (!game) {
    return <div className="text-center text-3xl mt-12 text-gray-400">Game not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <Image 
          src={game.screenshots[0]?.image || game.thumbnail} 
          alt={game.title} 
          layout="fill" 
          objectFit="cover" 
          className="brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute bottom-0 left-0 p-8 w-full"
        >
          <h1 className="text-6xl font-bold mb-4 text-shadow">{game.title}</h1>
          <p className="text-2xl text-gray-300">{game.genre}</p>
        </motion.div>
      </motion.div>

      {/* Game Details */}
      <div className="container mx-auto px-4 py-12">
        <Button onClick={() => router.back()} className="mb-8 bg-gray-800 hover:bg-gray-700">
          <ChevronLeft className="mr-2 h-4 w-4 text-white" /> Back to Games
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-2"
          >
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-gray-800 mb-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="requirements">System Requirements</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h2 className="text-3xl font-bold mb-4">About the Game</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">{game.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="requirements">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <h2 className="text-3xl font-bold mb-4">Minimum System Requirements</h2>
                    {game.minimum_system_requirements ? (
                      <ul className="space-y-4 text-lg">
                        <li className="flex items-center">
                          <Cpu className="mr-2 h-6 w-6 text-blue-400" />
                          <strong className="mr-2">OS:</strong> {game.minimum_system_requirements.os}
                        </li>
                        <li className="flex items-center">
                          <Cpu className="mr-2 h-6 w-6 text-green-400" />
                          <strong className="mr-2">Processor:</strong> {game.minimum_system_requirements.processor}
                        </li>
                        <li className="flex items-center">
                          <HardDrive className="mr-2 h-6 w-6 text-yellow-400" />
                          <strong className="mr-2">Memory:</strong> {game.minimum_system_requirements.memory}
                        </li>
                        <li className="flex items-center">
                          <Cpu className="mr-2 h-6 w-6 text-red-400" />
                          <strong className="mr-2">Graphics:</strong> {game.minimum_system_requirements.graphics}
                        </li>
                        <li className="flex items-center">
                          <HardDrive className="mr-2 h-6 w-6 text-purple-400" />
                          <strong className="mr-2">Storage:</strong> {game.minimum_system_requirements.storage}
                        </li>
                      </ul>
                    ) : (
                      <p className="text-lg">System requirements not available.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-4">Game Info</h3>
                <div className="space-y-3 text-lg">
                  <p className="flex items-center"><Tag className="mr-2 h-5 w-5 text-blue-400" /> <strong className="mr-2">Developer:</strong> {game.developer}</p>
                  <p className="flex items-center"><Globe className="mr-2 h-5 w-5 text-green-400" /> <strong className="mr-2">Publisher:</strong> {game.publisher}</p>
                  <p className="flex items-center"><Star className="mr-2 h-5 w-5 text-yellow-400" /> <strong className="mr-2">Platform:</strong> {game.platform}</p>
                  <p className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-red-400" /> <strong className="mr-2">Release Date:</strong> {game.release_date}</p>
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-bold mb-2">{price} ₽</p>
                  {originalPrice && (
                    <p className="text-lg text-gray-400 line-through">{originalPrice} ₽</p>
                  )}
                </div>
                <div className="flex gap-2 mt-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                          onClick={handleAddToCart}
                          disabled={isAdded}
                        >
                          {isAdded ? (
                            <>Added to Cart</>
                          ) : (
                            <>
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add this game to your cart</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          className={`flex-1 ${isWishlisted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'} text-lg py-6`}
                          onClick={toggleWishlist}
                        >
                          <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                          {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-lg py-6" asChild>
                        <a href={game.game_url} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-2 h-5 w-5" />
                          Play Now
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start playing the game</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Screenshot Gallery */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Screenshots</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <motion.div
                animate={{ x: `-${currentScreenshot * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex"
              >
                {game.screenshots.map((screenshot, index) => (
                  <div key={screenshot.id} className="w-full flex-shrink-0">
                    <Image 
                      src={screenshot.image || "/placeholder.svg"} 
                      alt={`Screenshot ${index + 1}`} 
                      width={1920} 
                      height={1080} 
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
              onClick={() => setCurrentScreenshot(prev => Math.max(0, prev - 1))}
              disabled={currentScreenshot === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75"
              onClick={() => setCurrentScreenshot(prev => Math.min(game.screenshots.length - 1, prev + 1))}
              disabled={currentScreenshot === game.screenshots.length - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>

        {/* Game Rating */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6">Game Rating</h2>
          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="flex items-center mb-6">
              <Star className="text-yellow-400 mr-2 h-8 w-8" />
              <span className="text-4xl font-bold">4.5</span>
              <span className="text-gray-400 ml-2 text-2xl">/ 5</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-24 text-lg">Graphics</span>
                <Progress value={85} className="flex-1 ml-4" />
                <span className="ml-4 text-lg">8.5</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-lg">Gameplay</span>
                <Progress value={90} className="flex-1 ml-4" />
                <span className="ml-4 text-lg">9.0</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-lg">Story</span>
                <Progress value={80} className="flex-1 ml-4" />
                <span className="ml-4 text-lg">8.0</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center">
            <MessageCircle className="mr-2 h-8 w-8" />
            Chat with Creators
          </h2>
          <Button
            onClick={handleChatClick}
            className="mb-4 bg-blue-600 hover:bg-blue-700"
          >
            Open Chat
          </Button>
        </motion.div>

        {/* Related Games */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Related Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedGames.map((relatedGame) => (
              <motion.div
                key={relatedGame.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="bg-gray-800 cursor-pointer overflow-hidden" 
                  onClick={() => router.push(`/game/${relatedGame.id}`)}
                >
                  <div className="relative h-48">
                    <Image 
                      src={relatedGame.thumbnail || "/placeholder.svg"} 
                      alt={relatedGame.title} 
                      layout="fill" 
                      objectFit="cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-1 text-lg">{relatedGame.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{relatedGame.short_description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

