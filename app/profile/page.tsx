"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Plus, Edit2, Save, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";

interface Game {
  id: string;
  game_name: string;
  description: string;
  images: string[];
  play_game: string;
  release_date: string;
}

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { cartItems, getTotalPrice, purchaseHistory } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userGames, setUserGames] = useState<Game[]>([]);
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Check if any field is empty
    if (
      !editForm.username.trim() ||
      !editForm.email.trim() ||
      !editForm.avatar.trim()
    ) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check if there are any changes
    if (
      editForm.username === user?.username &&
      editForm.email === user?.email &&
      editForm.avatar === user?.avatar
    ) {
      toast({
        title: "No Changes",
        description: "No changes were made to your profile",
      });
      setLoading(false);
      setIsEditing(false);
      return;
    }

    try {
      await updateProfile(editForm);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserGames = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `https://6794f90baad755a134eae279.mockapi.io/game?owner_id=${user.id}`
      );
      const data = await response.json();
      setUserGames(data);
    } catch (error) {
      console.error("Error fetching user games:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <div className="md:w-1/3">
            <Card className="bg-black border-gray-800 rounded-2xl mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Profile</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                  </Avatar>
                  {isEditing ? (
                    <form
                      onSubmit={handleUpdateProfile}
                      className="space-y-4 w-full"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              username: e.target.value,
                            })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                          id="avatar"
                          value={editForm.avatar}
                          onChange={(e) =>
                            setEditForm({ ...editForm, avatar: e.target.value })
                          }
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">{user?.username}</h2>
                      <p className="text-gray-400">{user?.email}</p>
                      <p className="text-xl font-bold mt-4">
                        Balance: {user?.balance} ₽
                      </p>
                      <Button
                        onClick={() => router.push("/topup")}
                        className="mt-4 bg-green-600 hover:bg-green-700"
                      >
                        Top Up Balance
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="bg-gray-800 w-full">
                <TabsTrigger value="games" className="flex-1">
                  My Games
                </TabsTrigger>
                <TabsTrigger value="cart" className="flex-1">
                  Cart
                </TabsTrigger>
                <TabsTrigger value="history" className="flex-1">
                  Purchase History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>My Games</CardTitle>
                      <Button
                        onClick={() => router.push("/add-product")}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Game
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userGames.map((game) => (
                        <Card
                          key={game.id}
                          className="bg-gray-800 border-gray-700"
                        >
                          <CardContent className="p-4">
                            <img
                              src={game.images[0] || "/placeholder.svg"}
                              alt={game.game_name}
                              className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <h3 className="font-bold text-lg mb-2">
                              {game.game_name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {game.description}
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-sm text-gray-400">
                                Released:{" "}
                                {new Date(
                                  game.release_date
                                ).toLocaleDateString()}
                              </span>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  window.open(game.play_game, "_blank")
                                }
                              >
                                Play
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cart">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Shopping Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cartItems.length === 0 ? (
                      <p className="text-gray-400">Your cart is empty</p>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={item.thumbnail || "/placeholder.svg"}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-gray-400">
                                  {item.quantity} x {item.price} ₽
                                </p>
                              </div>
                            </div>
                            <span className="font-bold">
                              {item.quantity * item.price} ₽
                            </span>
                          </div>
                        ))}
                        <div className="border-t border-gray-800 pt-4 mt-4">
                          <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-bold">
                              {getTotalPrice()} ₽
                            </span>
                          </div>
                          <Button
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                            onClick={() => router.push("/checkout")}
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="bg-black border-gray-800">
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {purchaseHistory.length === 0 ? (
                      <p className="text-gray-400">
                        No purchase history available
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {purchaseHistory.map((purchase) => (
                          <Card
                            key={purchase.id}
                            className="bg-black border-gray-700 rounded-2xl"
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">
                                  {new Date(purchase.date).toLocaleString()}
                                </span>
                                <span className="font-bold">
                                  {purchase.total} ₽
                                </span>
                              </div>
                              <div className="space-y-2">
                                {purchase.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-2"
                                  >
                                    <img
                                      src={item.thumbnail || "/placeholder.svg"}
                                      alt={item.title}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                    <span className="flex-1">{item.title}</span>
                                    <span className="text-sm text-gray-400">
                                      {item.quantity} x {item.price} ₽
                                    </span>
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
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
