"use client";

import { useCartStore } from "@/store/cart";
import { X, Plus, Minus, Trash2 } from "./icons";

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={closeCart}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">
              Cart ({getTotalItems()})
            </h2>
            <button
              onClick={closeCart}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🛒</div>
                  <p>Your cart is empty</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center space-x-3 rounded-lg border p-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        ${(item.priceCents / 100).toFixed(2)} {item.currency}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty - 1)}
                        className="rounded-full p-1 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.qty + 1)}
                        className="rounded-full p-1 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="rounded-full p-1 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${(getTotalPrice() / 100).toFixed(2)}</span>
              </div>
              <button className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
