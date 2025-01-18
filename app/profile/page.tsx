"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Menu,
  Share2,
  Star,
  ChevronRight,
  LogOut,
  ShoppingCart,
  Plus,
  History,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { GamerLoader } from "../components/gamer-loader";
import { GameComponentPayment } from "@/components/GameComponentPayment";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { cartItems, getTotalPrice } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <GamerLoader />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{user.username}</h1>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="mx-4 mt-4 bg-black border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-2 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-400">Баланс</p>
                <span className="text-2xl font-bold">{`${
                  user ? user.balance : 0
                } ₽`}</span>
              </div>
            </div>
            <Link href="/topup">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Пополнить
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <div className="p-4 flex items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-blue-500">
          <AvatarImage
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
          />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-current text-gray-600" />
            ))}
            <span className="ml-1">нет отзывов</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            на Playerok с ноября 2024
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="cart" className="w-full mt-4">
        <TabsList className="w-full justify-start gap-2 bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="cart"
            className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded"
          >
            Корзина {cartItems.length}
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded"
          >
            История покупок
          </TabsTrigger>
          <TabsTrigger
            value="components"
            className="flex-1 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded"
          >
            Игровые компоненты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cart" className="mt-4">
          {cartItems.length === 0 ? (
            <EmptyState
              emoji="🛒"
              title="Корзина пуста"
              description="Добавьте товары в корзину"
              buttonText="Выбрать игру/приложение"
              buttonHref="/"
            />
          ) : (
            <div className="space-y-4 p-4 ">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-black border-gray-700">
                  <CardContent className="p-4 flex items-center gap-4">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-400">
                        {item.quantity} x {item.price} ₽
                      </p>
                    </div>
                    <p className="font-bold">{item.quantity * item.price} ₽</p>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold">Итого:</span>
                <span className="text-xl font-bold">{getTotalPrice()} ₽</span>
              </div>
              <div className="text-center">
              <Link href="/checkout" className="">
                <Button className="w-30   bg-blue-600 hover:bg-blue-700 text-white mt-10">
                  Перейти к оплате
                </Button>
              </Link>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-10 text-center">
          <Link href="/history">
            <Button className="w-30  bg-blue-600 hover:bg-blue-700 text-white">
              <History className="mr-2 h-4 w-4" />
              Просмотреть историю покупок
            </Button>
          </Link>
        </TabsContent>

        <TabsContent value="components" className="mt-4">
          <GameComponentPayment />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ emoji, title, description, buttonText, buttonHref }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <span className="text-6xl mb-4">{emoji}</span>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-400 mb-6">{description}</p>
      <Link href={buttonHref}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
