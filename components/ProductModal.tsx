"use client";

import { Button } from "@/components/ui/button";
import { config } from "@/config/site";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ProductModalProps {
  product: {
    name: string;
    price: string;
    image: string;
    category?: string;
    rating?: number;
    reviews?: number;
    description?: string;
    [key: string]: any;
  } | null;
  onClose: () => void;
  onAddToCart?: () => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white/50 dark:bg-black/50 rounded-full p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-0 md:gap-8 max-h-[85vh] overflow-y-auto md:overflow-visible">
          {/* Product Image */}
          <div className="relative w-full h-64 md:h-full md:aspect-square bg-gray-100 dark:bg-gray-800 md:rounded-l-lg overflow-hidden flex-shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col p-6 md:p-8 md:pl-0">
            {product.category && (
              <p className="text-sm text-muted-foreground mb-2">
                {product.category}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(Math.round(product.rating || 4))].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-xl">
                    ★
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground">
                ({product.reviews || 0} reviews)
              </span>
            </div>

            <p className="text-3xl md:text-4xl font-bold text-green-600 mb-6">
              {product.price}
            </p>

            <p className="text-muted-foreground mb-6">
              {product.description ||
                `Premium quality ${
                  product.category?.toLowerCase() || "product"
                } for your farming needs. Carefully selected to ensure the best results for your arecanut plantation.`}
            </p>

            <div className="space-y-3 mt-auto">
              <Button
                onClick={() => {
                  onAddToCart?.();
                  onClose();
                }}
                disabled={product.is_out_of_stock}
                className={`w-full text-lg py-6 font-bold ${
                  product.is_out_of_stock
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-700 hover:bg-green-800 text-white"
                }`}
              >
                {product.is_out_of_stock ? "Sold Out" : "Add to Cart"}
              </Button>
              <Button
                onClick={() => {
                  window.open(
                    `https://wa.me/${
                      config.whatsappNumber
                    }?text=Hi, I am interested in ${encodeURIComponent(
                      product.name
                    )}`,
                    "_blank"
                  );
                }}
                variant="outline"
                className="w-full text-lg py-6"
              >
                Contact Seller
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
