"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    isLoading,
  } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCheckout = () => {
    if (session) {
      router.push("/checkout");
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-muted-foreground">Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 mt-2">
        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-4 text-center max-w-md">
          Looks like you haven&apos;t added any items to your cart yet. Browse
          our collection of high-quality arecanut plants and accessories.
        </p>
        <Link href="/#featured-products" className="pb-3">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg-card shadow-sm"
            >
              {/* Product Image */}
              <div className="h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {item.name}
                </h3>
                {item.category && (
                  <p className="text-sm text-muted-foreground mb-1">
                    {item.category}
                  </p>
                )}
                <div className="text-green-600 font-bold">
                  ₹{item.price.toLocaleString()}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="p-1 rounded-md hover:bg-muted disabled:opacity-50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-md hover:bg-muted"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Link
              href="/#featured-products"
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-card border rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 size-lg font-bold text-white"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Secure Checkout • Fast Delivery
            </p>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => router.push("/checkout")}
      />
    </div>
  );
}
