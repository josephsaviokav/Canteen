"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { cartApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export interface CartItem {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  item: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    available: boolean;
  };
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (userId: string, itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Check user on mount and when storage changes
  useEffect(() => {
    const checkUser = () => {
      const userString = localStorage.getItem("user");
      if (!userString) {
        setUserId(null);
        setCart([]);
        return;
      }
      
      const user = JSON.parse(userString);
      setUserId(user.id);
    };

    // Check on mount
    checkUser();

    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", checkUser);

    // Listen for custom login/logout events
    window.addEventListener("userChanged", checkUser);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("userChanged", checkUser);
    };
  }, [router]);

  const refreshCart = async () => {
    if (!userId) return;
    
    try {
      const cartItems = await cartApi.getCartItems(userId);
      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCart([]);
    }
  };

  useEffect(() => {
    if (userId) {
      refreshCart();
    }
  }, [userId]);


  const addToCart = async (userId: string, itemId: string, quantity: number) => {
    try {
      await cartApi.addToCart(userId, itemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    try {
      await cartApi.updateCartItem(cartItemId, quantity);
      await refreshCart();
    } catch (error) {
      console.error("Failed to update cart item:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await cartApi.deleteCartItem(cartItemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
