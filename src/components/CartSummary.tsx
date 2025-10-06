"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  isGuest?: boolean;
}

export default function CartSummary({ subtotal, itemCount, isGuest = false }: CartSummaryProps) {
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-light-100 rounded-lg border border-light-300 p-6 h-fit sticky top-20">
      <h2 className="text-heading-3 text-dark-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-body text-dark-700">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-body text-dark-700">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between text-body text-dark-700">
          <span>Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        {shipping === 0 && (
          <div className="text-caption text-green bg-green/10 px-3 py-2 rounded-md">
            🎉 You qualify for free shipping!
          </div>
        )}
        
        {subtotal < 100 && (
          <div className="text-caption text-dark-700 bg-light-200 px-3 py-2 rounded-md">
            Add ${(100 - subtotal).toFixed(2)} more to get free shipping
          </div>
        )}
      </div>
      
      <div className="border-t border-light-300 pt-4 mb-6">
        <div className="flex justify-between text-lead text-dark-900 font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {isGuest ? (
        <div className="space-y-3">
          <Link
            href="/sign-in?redirect=/cart"
            className="w-full bg-dark-900 text-light-100 py-3 px-6 rounded-md hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            Sign In to Checkout
          </Link>
          <p className="text-caption text-dark-500 text-center">
            Sign in or create an account to proceed with checkout
          </p>
        </div>
      ) : (
        <Link
          href="/checkout"
          className="w-full bg-dark-900 text-light-100 py-3 px-6 rounded-md hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <ShoppingBag className="w-5 h-5" />
          Proceed to Checkout
        </Link>
      )}

      <div className="mt-4 space-y-2 text-caption text-dark-500">
        <p>✓ Secure checkout</p>
        <p>✓ 30-day return policy</p>
        <p>✓ Free returns on all orders</p>
      </div>
    </div>
  );
}
