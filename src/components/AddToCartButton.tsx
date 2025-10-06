"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { addCartItem } from "@/lib/actions/cart";
import { useCartStore } from "@/store/cart";
import { getCart } from "@/lib/actions/cart";
import { createGuestSession } from "@/lib/auth/actions";

interface AddToCartButtonProps {
  productVariantId: string;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function AddToCartButton({
  productVariantId,
  quantity = 1,
  className = "",
  disabled = false,
  size = "md",
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const setCart = useCartStore((state) => state.setCart);

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await createGuestSession();
      const result = await addCartItem(productVariantId, quantity);

      if (result.success) {
        const cartData = await getCart();
        if (cartData.success && cartData.items) {
          setCart(cartData.items, cartData.total, cartData.itemCount);
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(result.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`
        ${sizeClasses[size]}
        bg-dark-900 text-light-100 rounded-md 
        hover:bg-dark-700 
        disabled:bg-dark-500 disabled:cursor-not-allowed
        transition-all duration-200
        flex items-center justify-center gap-2
        font-medium
        ${showSuccess ? 'bg-green hover:bg-green' : ''}
        ${className}
      `}
    >
      {showSuccess ? (
        <>
          <span>✓</span>
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
        </>
      )}
    </button>
  );
}
