"use client";

import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { Star } from "lucide-react";
import AddToCartButton from "./AddToCartButton";

interface Size {
  id: string;
  value: string;
  available: boolean;
  variantId?: string;
}

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviewCount: number;
    price: number;
    compareAtPrice?: number;
    discount?: number;
    description: string;
    sizes: Size[];
    defaultVariantId?: string | null;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  useEffect(() => {
    if (product.defaultVariantId) {
      const defaultSize = product.sizes.find(s => s.variantId === product.defaultVariantId);
      if (defaultSize && defaultSize.available) {
        setSelectedSize(defaultSize.id);
        setSelectedVariantId(defaultSize.variantId || null);
        return;
      }
    }
    
    const firstAvailable = product.sizes.find(s => s.available);
    if (firstAvailable) {
      setSelectedSize(firstAvailable.id);
      setSelectedVariantId(firstAvailable.variantId || null);
    }
  }, [product.sizes, product.defaultVariantId]);

  const handleSizeSelect = (sizeId: string, available: boolean) => {
    if (available) {
      setSelectedSize(sizeId);
      const size = product.sizes.find(s => s.id === sizeId);
      setSelectedVariantId(size?.variantId || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and Category */}
      <div>
        <h1 className="text-heading-3 md:text-heading-2 text-dark-900 mb-2">
          {product.name}
        </h1>
        <p className="text-body text-dark-700">{product.category}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.floor(product.rating)
                  ? 'fill-orange text-orange'
                  : 'fill-light-300 text-light-300'
              }`}
            />
          ))}
        </div>
        <span className="text-body text-dark-900 font-medium">
          {product.rating}
        </span>
        <span className="text-body text-dark-700">
          ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-heading-3 text-dark-900 font-medium">
          ${product.price.toFixed(2)}
        </span>
        {hasDiscount && product.compareAtPrice && (
          <>
            <span className="text-body-medium text-dark-700 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
            <span className="bg-red text-light-100 px-2 py-1 rounded text-caption font-medium">
              -{product.discount}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      <div className="text-body text-dark-700 leading-relaxed">
        {product.description}
      </div>

      {/* Size Picker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-caption text-dark-700 font-medium">
            Select Size {selectedSize && (
              <span className="text-dark-900">
                - {product.sizes.find(s => s.id === selectedSize)?.value}
              </span>
            )}
          </p>
          <button className="text-caption text-dark-700 hover:text-dark-900 underline focus:outline-none focus:ring-2 focus:ring-dark-900 rounded">
            Size Guide
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSizeSelect(size.id, size.available)}
              disabled={!size.available}
              className={`
                relative h-12 rounded-lg border-2 text-body-medium transition-all
                ${size.available 
                  ? selectedSize === size.id
                    ? 'border-dark-900 bg-dark-900 text-light-100'
                    : 'border-light-300 hover:border-dark-900 text-dark-900'
                  : 'border-light-300 text-dark-500 cursor-not-allowed opacity-50'
                }
                focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2
              `}
              aria-label={`Size ${size.value}${size.available ? '' : ' - Out of stock'}`}
              aria-pressed={selectedSize === size.id}
            >
              <span className={!size.available ? 'line-through' : ''}>
                {size.value}
              </span>
            </button>
          ))}
        </div>

        {!selectedSize && (
          <p className="text-caption text-dark-700">
            Please select a size to continue
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {selectedVariantId ? (
          <AddToCartButton
            productVariantId={selectedVariantId}
            quantity={1}
            className="flex-1"
            disabled={!selectedSize}
            size="lg"
          />
        ) : (
          <button
            disabled
            className="flex-1 bg-dark-500 text-light-100 py-4 px-6 rounded-lg font-medium text-body-medium cursor-not-allowed flex items-center justify-center gap-2"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-5 h-5" />
            Select a Size
          </button>
        )}
        <button
          className="w-14 h-14 border-2 border-light-300 rounded-lg flex items-center justify-center hover:border-dark-900 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
          aria-label="Add to favorites"
        >
          <Heart className="w-6 h-6 text-dark-900" />
        </button>
      </div>

      {/* Delivery Info */}
      <div className="bg-light-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-dark-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-medium text-dark-900 font-medium">Free Delivery</p>
            <p className="text-caption text-dark-700">
              Enter your postal code for availability
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-dark-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-body-medium text-dark-900 font-medium">Free Returns</p>
            <p className="text-caption text-dark-700">
              Free 30-day returns. Details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
