"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: string; // unique cart item id (e.g., Date.now().toString())
  productId: string;
  name: string;
  priceAtSale: number;
  quantity: number;
  variantSnapshot: any;
  modifiersSnapshot: any;
  note: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  orderType: string;
  setOrderType: (val: string) => void;
  reservationTime: string;
  setReservationTime: (val: string) => void;
  pax: number;
  setPax: (val: number) => void;
  tableId: string;
  setTableId: (val: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children, tenantId }: { children: React.ReactNode; tenantId: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("DINE_IN");
  const [reservationTime, setReservationTime] = useState<string>("");
  const [pax, setPax] = useState<number>(1);
  const [tableId, setTableId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // URL param parsing
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tableParam = urlParams.get("table");
      if (tableParam) setTableNumber(tableParam);
    }
    
    const saved = localStorage.getItem(`omnia-cart-${tenantId}`);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, [tenantId]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`omnia-cart-${tenantId}`, JSON.stringify(items));
    }
  }, [items, isLoaded, tenantId]);

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalAmount = items.reduce((sum, item) => sum + item.priceAtSale * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, updateQuantity, removeItem, clearCart, totalAmount, 
      tableNumber, setTableNumber,
      orderType, setOrderType,
      reservationTime, setReservationTime,
      pax, setPax,
      tableId, setTableId
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
