"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-light-200 rounded-full flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-dark-500" />
      </div>
      
      <h2 className="text-heading-3 text-dark-900 mb-2">Your cart is empty</h2>
      
      <p className="text-body text-dark-500 text-center mb-8 max-w-md">
        Looks like you haven&apos;t added anything to your cart yet. Start shopping to find your perfect products!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="bg-dark-900 text-light-100 py-3 px-8 rounded-md hover:bg-dark-700 transition-colors font-medium"
        >
          Start Shopping
        </Link>
        
        <Link
          href="/products?sale=true"
          className="border border-dark-900 text-dark-900 py-3 px-8 rounded-md hover:bg-light-200 transition-colors font-medium"
        >
          View Sale Items
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="text-2xl mb-2">🚚</div>
          <h3 className="text-body-medium text-dark-900 mb-1">Free Shipping</h3>
          <p className="text-caption text-dark-500">On orders over $100</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-2">🔄</div>
          <h3 className="text-body-medium text-dark-900 mb-1">Easy Returns</h3>
          <p className="text-caption text-dark-500">30-day return policy</p>
        </div>
        
        <div className="text-center">
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="text-body-medium text-dark-900 mb-1">Secure Checkout</h3>
          <p className="text-caption text-dark-500">Safe & encrypted</p>
        </div>
      </div>
    </div>
  );
}
