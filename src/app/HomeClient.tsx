"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/products";
import ProductCard from "@/components/ProductCard";

interface Product {
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

interface HomeClientProps {
  products: Product[];
  usingMockData: boolean;
}

export default function HomeClient({ products, usingMockData }: HomeClientProps) {
  const { setProducts } = useProductStore();

  // Update the store with products from server
  useEffect(() => {
    setProducts(products);
  }, [products, setProducts]);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold mb-6">Adidas Products</h1>
      
      {usingMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">🎉 Demo Mode</h2>
          <p className="text-blue-700">Showing mock data! To connect a real database:</p>
          <div className="mt-4 text-sm text-blue-600">
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Create a Neon database at <a href="https://neon.tech" className="underline" target="_blank" rel="noopener noreferrer">neon.tech</a></li>
              <li>Add your DATABASE_URL to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
              <li>Run <code className="bg-blue-100 px-1 rounded">npm run db:push</code> and <code className="bg-blue-100 px-1 rounded">npm run db:seed</code></li>
            </ol>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
