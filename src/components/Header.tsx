"use client";

import { useCartStore } from "@/store/cart";
import { ShoppingCart, User } from "./icons";

export default function Header() {
  const { openCart, getTotalItems } = useCartStore();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Nike Store</h1>
            <p className="text-sm text-gray-500">Premium Athletic Wear</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* User Icon */}
            <button className="rounded-full p-2 hover:bg-gray-100">
              <User className="h-6 w-6" />
            </button>
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative rounded-full p-2 hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
