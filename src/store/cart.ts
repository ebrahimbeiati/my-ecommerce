import { create } from 'zustand';

export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  quantity: number;
  productId: string;
  productName: string;
  sku: string;
  price: number;
  originalPrice: number;
  salePrice: number | null;
  inStock: number;
  imageUrl: string | null;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  // Actions
  setCart: (items: CartItem[], total: number, itemCount: number) => void;
  setLoading: (loading: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  // Computed values
  getItemCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
  isOpen: false,
  
  setCart: (items, total, itemCount) => {
    set({ items, total, itemCount });
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
  getItemCount: () => get().itemCount,
  getTotalPrice: () => get().total,
}));