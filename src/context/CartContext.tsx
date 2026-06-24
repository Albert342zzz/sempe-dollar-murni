"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  flavorId: string;
  size: string;
  qty: number;
};

type LineRef = { flavorId: string; size: string };

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  addItem: (flavorId: string, size: string, qty?: number) => void;
  increment: (flavorId: string, size: string) => void;
  decrement: (flavorId: string, size: string) => void;
  removeItem: (flavorId: string, size: string) => void;
  updateLine: (current: LineRef, next: LineRef) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sdm-cart";

const sameLine = (i: CartItem, flavorId: string, size: string) =>
  i.flavorId === flavorId && i.size === size;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load the cart from localStorage once on mount.
  useEffect(() => {
    let next: CartItem[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null) next = JSON.parse(raw);
    } catch {
      next = [];
    }
    // setState inside this effect is intentional: localStorage is read after the
    // first render so the initial HTML matches the SSR output (hydration-safe).
    /* eslint-disable react-hooks/set-state-in-effect */
    setItems(next);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Simpan setiap kali keranjang berubah (setelah hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // abaikan error kuota
    }
  }, [items, hydrated]);

  function addItem(flavorId: string, size: string, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex((i) => sameLine(i, flavorId, size));
      if (idx === -1) return [...prev, { flavorId, size, qty }];
      return prev.map((i, n) =>
        n === idx ? { ...i, qty: i.qty + qty } : i
      );
    });
  }

  function increment(flavorId: string, size: string) {
    setItems((prev) =>
      prev.map((i) =>
        sameLine(i, flavorId, size) ? { ...i, qty: i.qty + 1 } : i
      )
    );
  }

  function decrement(flavorId: string, size: string) {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (!sameLine(i, flavorId, size)) return [i];
        if (i.qty <= 1) return []; // hapus baris ketika mencapai 0
        return [{ ...i, qty: i.qty - 1 }];
      })
    );
  }

  function removeItem(flavorId: string, size: string) {
    setItems((prev) => prev.filter((i) => !sameLine(i, flavorId, size)));
  }

  function updateLine(current: LineRef, next: LineRef) {
    setItems((prev) => {
      const curIdx = prev.findIndex((i) =>
        sameLine(i, current.flavorId, current.size)
      );
      if (curIdx === -1) return prev;

      // Apakah varian baru bentrok dengan baris lain yang sudah ada?
      const collideIdx = prev.findIndex(
        (i, n) => n !== curIdx && sameLine(i, next.flavorId, next.size)
      );

      if (collideIdx === -1) {
        // ubah di tempat, posisi tetap
        return prev.map((i, n) =>
          n === curIdx
            ? { ...i, flavorId: next.flavorId, size: next.size }
            : i
        );
      }

      // gabungkan qty ke baris yang bentrok, lalu hapus baris asal
      const curQty = prev[curIdx].qty;
      return prev
        .map((i, n) => (n === collideIdx ? { ...i, qty: i.qty + curQty } : i))
        .filter((_, n) => n !== curIdx);
    });
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    totalCount,
    addItem,
    increment,
    decrement,
    removeItem,
    updateLine,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}
