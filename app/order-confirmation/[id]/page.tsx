"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Since it's a client component, we can fetch order details from an API if needed
// For now, we'll just display the success message and ID
// In a real app, you'd fetch the order by ID to show details

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [orderParams, setOrderParams] = useState<{ id: string } | null>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setOrderParams(p);
      // Fetch order details
      fetch(`/api/user/orders/${p.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setOrder(data);
        })
        .catch((err) => console.error("Error fetching order:", err));
    });
  }, [params]);

  if (!orderParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-16 md:px-6 min-h-[70vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>

      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Thank you for your purchase. We have received your order and are
        processing it.
      </p>

      <div className="bg-card border rounded-lg p-6 shadow-sm w-full max-w-sm mb-8">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-sm text-muted-foreground">Order ID</span>
          <span className="font-mono font-medium">
            #{order?.user_order_number ?? orderParams.id}
          </span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
            <Package className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Estimated Delivery</p>
            <p className="text-xs text-muted-foreground">3-5 Business Days</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/account?tab=orders">
          <Button variant="outline">View Order Status</Button>
        </Link>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
