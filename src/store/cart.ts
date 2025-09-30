import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  title: string;
  priceCents: number;
  currency: string;
  imageUrl?: string | null;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  clear: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: number) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId 
                  ? { ...i, qty: i.qty + qty } 
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        }),
      
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      
      updateQuantity: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, qty: Math.max(0, qty) } : i
          ).filter((i) => i.qty > 0),
        })),
      
      clear: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.qty, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.priceCents * item.qty), 0);
      },
      
      getItemQuantity: (productId) => {
        const { items } = get();
        const item = items.find((i) => i.productId === productId);
        return item ? item.qty : 0;
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);


