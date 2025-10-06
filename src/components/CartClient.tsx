"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import CartItemComponent from "./CartItemComponent";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import { getCart } from "@/lib/actions/cart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CartClientProps {
  initialCart: Awaited<ReturnType<typeof getCart>>;
  isGuest: boolean;
}

export default function CartClient({ initialCart, isGuest }: CartClientProps) {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const itemCount = useCartStore((state) => state.itemCount);
  const setCart = useCartStore((state) => state.setCart);
  const setLoading = useCartStore((state) => state.setLoading);

  // Initialize cart from server data
  useEffect(() => {
    if (initialCart.success && initialCart.items) {
      setCart(initialCart.items, initialCart.total, initialCart.itemCount);
    }
  }, [initialCart, setCart]);

  // Refresh cart data
  const refreshCart = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      if (cartData.success && cartData.items) {
        setCart(cartData.items, cartData.total, cartData.itemCount);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!initialCart.success || items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      {/* Continue Shopping Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-body text-dark-700 hover:text-dark-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-light-100 rounded-lg border border-light-300 p-4 sm:p-6">
            <h2 className="text-heading-3 text-dark-900 mb-4">Cart Items</h2>
            
            <div className="divide-y divide-light-300">
              {items.map((item) => (
                <CartItemComponent 
                  key={item.id} 
                  item={item} 
                  onUpdate={refreshCart}
                />
              ))}
            </div>
          </div>

          {/* Mobile Summary - Show on small screens */}
          <div className="lg:hidden mt-6">
            <CartSummary 
              subtotal={total} 
              itemCount={itemCount}
              isGuest={isGuest}
            />
          </div>
        </div>

        {/* Order Summary - Desktop */}
        <div className="hidden lg:block">
          <CartSummary 
            subtotal={total} 
            itemCount={itemCount}
            isGuest={isGuest}
          />
        </div>
      </div>
    </>
  );
}
