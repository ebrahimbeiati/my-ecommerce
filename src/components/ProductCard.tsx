"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";

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

  return (
    <Link 
      href={`/products/${product.slug}`}
      className="group block rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
    >
      <div className="text-sm text-dark-700">{product.brand}</div>
      <div className="text-lg font-semibold text-dark-900">{product.title}</div>
      
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="mt-2 h-40 w-full rounded object-cover"
        />
      )}
      
      <p className="mt-2 text-sm text-dark-700 line-clamp-2">{product.description}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-bold text-dark-900">
          ${(product.priceCents / 100).toFixed(2)} {product.currency}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              // Wishlist functionality can be added here
            }}
            className="p-2 rounded hover:bg-light-200 transition-colors"
          >
            <Heart className="h-5 w-5 text-dark-700" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/products/${product.slug}`;
            }}
            className="flex items-center gap-1 rounded-lg bg-dark-900 px-3 py-2 text-sm text-light-100 transition-colors hover:bg-dark-700"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
