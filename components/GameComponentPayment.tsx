"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GamerLoader } from "@/app/components/gamer-loader";
import { useAuth } from "@/app/contexts/AuthContext";

interface GameComponent {
  id: string;
  name: string;
  price: number;
  description: string;
}

export function GameComponentPayment() {
  const [components, setComponents] = useState<GameComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<GameComponent | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { user, updateBalance } = useAuth();

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const response = await fetch("/api/game-components");
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
      }
    } catch (error) {
      console.error("Error fetching game components:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedComponent || !user) return;

    const totalCost = selectedComponent.price * quantity;

    if (user.balance < totalCost) {
      alert("Недостаточно средств на балансе");
      return;
    }

    try {
      const response = await fetch("/api/purchase-component", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          componentId: selectedComponent.id,
          quantity,
          totalCost,
        }),
      });

      if (response.ok) {
        updateBalance(-totalCost);
        alert("Покупка успешно совершена");
        setSelectedComponent(null);
        setQuantity(1);
      } else {
        alert("Ошибка при совершении покупки");
      }
    } catch (error) {
      console.error("Error purchasing component:", error);
      alert("Ошибка при совершении покупки");
    }
  };

  if (loading) {
    return <GamerLoader />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Игровые компоненты</h2>
      {components.map((component) => (
        <Card key={component.id} className="bg-gray-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{component.name}</h3>
                <p className="text-sm text-gray-400">{component.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{component.price} ₽</p>
                <Button
                  onClick={() => setSelectedComponent(component)}
                  className="mt-2"
                >
                  Выбрать
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedComponent && (
        <Card className="bg-gray-800 mt-6">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Покупка компонента</h3>
            <p className="mb-2">
              {selectedComponent.name} - {selectedComponent.price} ₽
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-20"
              />
              <p>Итого: {selectedComponent.price * quantity} ₽</p>
            </div>
            <Button onClick={handlePurchase} className="w-full">
              Купить
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

