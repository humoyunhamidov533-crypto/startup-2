import { createContext, useContext, useState, ReactNode } from "react";
import type { FoodItem } from "./data";

interface CartItem {
  food: FoodItem;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  add: (food: FoodItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (food: FoodItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.food.id === food.id);
      if (existing) return prev.map(i => i.food.id === food.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { food, qty: 1 }];
    });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.food.id !== id));
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.food.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
