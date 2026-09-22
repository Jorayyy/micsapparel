"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "micsapparel-cart-v1";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  ready: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        item &&
        typeof item.productId === "string" &&
        typeof item.price === "number" &&
        typeof item.qty === "number"
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setItems(loadCart());
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable
    }
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return {
      items,
      count,
      subtotal,
      isOpen,
      ready,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (item, qty = 1) => {
        const key = `${item.productId}:${item.variantId ?? "default"}`;
        setItems((current) => {
          const existing = current.find((entry) => entry.key === key);
          if (existing) {
            return current.map((entry) =>
              entry.key === key
                ? { ...entry, qty: Math.min(99, entry.qty + qty) }
                : entry
            );
          }
          return [...current, { ...item, key, qty }];
        });
        setIsOpen(true);
      },
      setQty: (key, qty) => {
        setItems((current) =>
          qty <= 0
            ? current.filter((entry) => entry.key !== key)
            : current.map((entry) =>
                entry.key === key ? { ...entry, qty: Math.min(99, qty) } : entry
              )
        );
      },
      remove: (key) => setItems((current) => current.filter((entry) => entry.key !== key)),
      clear: () => setItems([]),
    };
  }, [items, isOpen, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
