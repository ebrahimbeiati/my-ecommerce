import { getCart } from "@/lib/actions/cart";
import { getCurrentUser, createGuestSession } from "@/lib/auth/actions";
import CartClient from "@/components/CartClient";

export const metadata = {
  title: "Shopping Cart | Your Store",
  description: "Review your shopping cart and proceed to checkout",
};

export default async function CartPage() {
  // Ensure guest session exists for non-authenticated users
  const user = await getCurrentUser();
  if (!user) {
    await createGuestSession();
  }

  // Fetch cart data
  const cartData = await getCart();

  return (
    <div className="min-h-screen bg-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-2 text-dark-900 mb-2">Shopping Cart</h1>
          <p className="text-body text-dark-500">
            {cartData.itemCount > 0
              ? `You have ${cartData.itemCount} ${cartData.itemCount === 1 ? 'item' : 'items'} in your cart`
              : 'Your cart is currently empty'}
          </p>
        </div>

        <CartClient 
          initialCart={cartData} 
          isGuest={!user}
        />
      </div>
    </div>
  );
}
