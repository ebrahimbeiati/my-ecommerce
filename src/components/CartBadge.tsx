"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { getCart } from "@/lib/actions/cart";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const itemCount = useCartStore((state) => state.itemCount);
  const setCart = useCartStore((state) => state.setCart);

  // Fetch cart data on mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getCart();
        if (cartData.success && cartData.items) {
          setCart(cartData.items, cartData.total, cartData.itemCount);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();
  }, [setCart]);

  return (
    <Link
      href="/cart"
      className="text-dark-900 hover:text-dark-700 transition-colors flex items-center space-x-2 relative"
    >
      <span className="sr-only">Shopping cart</span>
      <div className="relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red text-light-100 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      <span className="text-sm font-medium hidden sm:inline">
        My Cart
      </span>
    </Link>
  );
}
