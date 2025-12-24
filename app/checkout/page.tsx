"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/cart");
    }
  }, [status]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          totalAmount: cartTotal,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true); // Mark as success to prevent empty cart flash
        clearCart();
        router.push(`/order-confirmation/${data.orderId}`);
      } else {
        alert(data.error || "Payment failed");
        setIsProcessing(false); // Only stop processing on error
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong");
      setIsProcessing(false);
    }
    // Note: We don't verify finally{setIsProcessing(false)} here because on success we want to keep showing the loading/processing state until redirection happens.
  };

  if (status === "loading" || isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Mock Payment Form */}
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-900">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-green-600" />
              Secure Payment
            </h2>
            <p className="text-muted-foreground mb-4">
              This is a mock checkout page. No real payment will be processed.
            </p>
            <div className="space-y-4">
              <div className="p-4 border rounded bg-background">
                <p className="font-medium">Selected Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  UPI / Net Banking
                </p>
              </div>
              <Button
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold text-white"
                disabled={isProcessing}
                onClick={handlePayment}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${cartTotal.toLocaleString()}`
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Truck className="h-4 w-4" /> Fast Delivery
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Quality Assured
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border rounded-lg p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">
                      Qty: {item.quantity}
                    </span>
                    <span className="font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
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
        </div>
      </div>
    </div>
  );
}
