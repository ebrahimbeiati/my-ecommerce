import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  brand: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getProductById: (id: number) => Product | undefined;
  getProductsByBrand: (brand: string) => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      
      setProducts: (products) => set({ products }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      getProductById: (id) => {
        const { products } = get();
        return products.find(p => p.id === id);
      },
      
      getProductsByBrand: (brand) => {
        const { products } = get();
        return products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      },
    }),
    {
      name: "product-store",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
