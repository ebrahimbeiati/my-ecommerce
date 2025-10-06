"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { updateCartItem, removeCartItem } from "@/lib/actions/cart";
import { CartItem } from "@/store/cart";

interface CartItemComponentProps {
  item: CartItem;
  onUpdate: () => void;
}

export default function CartItemComponent({ item, onUpdate }: CartItemComponentProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      const result = await updateCartItem(item.id, newQuantity);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      const result = await removeCartItem(item.id);
      if (result.success) {
        onUpdate();
      } else {
        alert(result.error || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-4 py-6 border-b border-light-300">
      {/* Product Image */}
      <Link
        href={`/products/${item.productId}`}
        className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-light-200 rounded-lg overflow-hidden hover:opacity-75 transition-opacity"
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-light-200">
            <span className="text-dark-500 text-xs">No image</span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.productId}`}
            className="text-body-medium text-dark-900 hover:text-dark-700 transition-colors"
          >
            {item.productName}
          </Link>
          <p className="text-caption text-dark-500 mt-1">SKU: {item.sku}</p>
          
          {/* Price */}
          <div className="mt-2 flex items-center gap-2">
            {item.salePrice && item.salePrice < item.originalPrice ? (
              <>
                <span className="text-body-medium text-red font-semibold">
                  ${item.salePrice.toFixed(2)}
                </span>
                <span className="text-caption text-dark-500 line-through">
                  ${item.originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-body-medium text-dark-900 font-semibold">
                ${item.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {item.inStock < 5 && item.inStock > 0 && (
            <p className="text-caption text-orange mt-1">
              Only {item.inStock} left in stock
            </p>
          )}
          {item.inStock === 0 && (
            <p className="text-caption text-red mt-1">Out of stock</p>
          )}
        </div>

        {/* Quantity Controls and Remove */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-2 border border-light-300 rounded-md hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-dark-700" />
            </button>
            
            <span className="text-body-medium text-dark-900 min-w-[40px] text-center">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.inStock}
              className="p-2 border border-light-300 rounded-md hover:bg-light-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-dark-700" />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-red hover:text-red/80 transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Subtotal - Desktop only */}
      <div className="hidden sm:flex flex-col items-end justify-between">
        <span className="text-body-medium text-dark-900 font-semibold">
          ${item.subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
