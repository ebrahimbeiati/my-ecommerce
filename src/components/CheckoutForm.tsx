"use client";

import { useState } from "react";
import { clearCart } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

interface CheckoutFormProps {
  total: number;
  itemCount: number;
}

export default function CheckoutForm({ total, itemCount }: CheckoutFormProps) {
  const router = useRouter();
  const setCart = useCartStore((state) => state.setCart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const shipping = total > 100 ? 0 : 10;
  const tax = total * 0.1;
  const finalTotal = total + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === "expiryDate") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length >= 2) {
        formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4);
      }
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    // Format CVV (3-4 digits only)
    if (name === "cvv") {
      const formatted = value.replace(/\D/g, "").slice(0, 4);
      setFormData({ ...formData, [name]: formatted });
      return;
    }
    
    setFormData({ ...formData, [name]: value });
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, "");
    
    // Must be 16 digits
    if (!/^\d{16}$/.test(cleaned)) {
      return false;
    }
    
    // Luhn algorithm validation
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiryDate: string): boolean => {
    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;
    
    // Validate month range
    if (month < 1 || month > 12) return false;
    
    // Check if date is in the future
    const now = new Date();
    const expiry = new Date(year, month - 1);
    
    return expiry >= now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.state || !formData.zipCode ||
        !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
      alert("Please fill in all fields");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Card number validation
    if (!validateCardNumber(formData.cardNumber)) {
      alert("Please enter a valid 16-digit card number");
      return;
    }

    // Expiry date validation
    if (!validateExpiryDate(formData.expiryDate)) {
      alert("Please enter a valid expiry date (MM/YY) in the future");
      return;
    }

    // CVV validation
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      alert("Please enter a valid 3 or 4 digit CVV");
      return;
    }

    // ZIP/Postal code validation (international - 3-10 alphanumeric characters)
    if (!/^[A-Z0-9\s-]{3,10}$/i.test(formData.zipCode.trim())) {
      alert("Please enter a valid postal code");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart
      const result = await clearCart();
      
      if (result.success) {
        // Update cart state
        setCart([], 0, 0);
        
        // Redirect to success page
        alert("Order placed successfully! 🎉\nThank you for your purchase!");
        router.push("/");
      } else {
        alert("Failed to complete order. Please try again.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="bg-light-100 rounded-lg border border-light-300 p-6">
          <h2 className="text-heading-3 text-dark-900 mb-6">Shipping Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-medium text-dark-900 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-body-medium text-dark-900 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-body-medium text-dark-900 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-body-medium text-dark-900 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                placeholder="123 Main St"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-body-medium text-dark-900 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <label className="block text-body-medium text-dark-900 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  placeholder="NY"
                  required
                />
              </div>
              <div>
                <label className="block text-body-medium text-dark-900 mb-2">
                  Postal/ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                  placeholder="10001 or A1A 1A1"
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-heading-3 text-dark-900 mb-6">Payment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-body-medium text-dark-900 mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-medium text-dark-900 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      maxLength={5}
                      className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-body-medium text-dark-900 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      maxLength={4}
                      className="w-full px-4 py-3 border border-light-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-900"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full mt-6 bg-dark-900 text-light-100 py-3 px-6 rounded-md hover:bg-dark-700 transition-colors font-medium disabled:bg-dark-500"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-light-100 rounded-lg border border-light-300 p-6 sticky top-20">
          <h2 className="text-heading-3 text-dark-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-body text-dark-700">
              <span>Subtotal ({itemCount} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-body text-dark-700">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between text-body text-dark-700">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="border-t border-light-300 pt-4 mb-6">
            <div className="flex justify-between text-lead text-dark-900 font-semibold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-2 text-caption text-dark-500">
            <p>✓ Secure checkout</p>
            <p>✓ 30-day return policy</p>
            <p>✓ Free returns on all orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
