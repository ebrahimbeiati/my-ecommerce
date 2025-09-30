"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCart, Plus } from "./icons";

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      title: product.title,
      priceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className="group rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="text-sm text-gray-500">{product.brand}</div>
      <div className="text-lg font-semibold">{product.title}</div>
      
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="mt-2 h-40 w-full rounded object-cover"
        />
      )}
      
      <p className="mt-2 text-sm text-gray-700">{product.description}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-bold text-green-600">
          ${(product.priceCents / 100).toFixed(2)} {product.currency}
        </div>
        
        <button
          onClick={handleAddToCart}
          className="flex items-center space-x-1 rounded-lg bg-black px-3 py-2 text-sm text-white transition-colors hover:bg-gray-800"
        >
          {quantity > 0 ? (
            <>
              <Plus className="h-4 w-4" />
              <span>Add More ({quantity})</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
