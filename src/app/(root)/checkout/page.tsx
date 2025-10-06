import { getCart } from "@/lib/actions/cart";
import { getCurrentUser } from "@/lib/auth/actions";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Checkout | Your Store",
  description: "Complete your purchase",
};

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  
  // Redirect guests to sign in
  if (!user) {
    redirect("/sign-in?redirect=/checkout");
  }

  const cartData = await getCart();

  // Redirect if cart is empty
  if (!cartData.success || cartData.itemCount === 0) {
    redirect("/cart");
  }

  return (
    <div className="min-h-screen bg-light-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back to Cart Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-body text-dark-700 hover:text-dark-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        
        <h1 className="text-heading-2 text-dark-900 mb-8">Checkout</h1>
        
        <CheckoutForm 
          total={cartData.total} 
          itemCount={cartData.itemCount}
        />
      </div>
    </div>
  );
}
