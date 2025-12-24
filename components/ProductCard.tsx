"use client";

import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id?: string | number;
  name: string;
  price: string;
  image: string;
  rating?: number;
  reviews?: number;
  highlights?: string[];
  category?: string;
  badge?: string;
  onAddToCart?: (e: React.MouseEvent) => void;
  onViewDetails?: () => void;
  className?: string;
  compact?: boolean;
  isOutOfStock?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating = 4,
  reviews = 0,
  highlights = [],
  category,
  badge,
  onAddToCart,
  onViewDetails,
  className = "",
  compact = false,
  isOutOfStock = false,
}: ProductCardProps) {
  return (
    <div
      className={`bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative ${
        isOutOfStock ? "opacity-75 grayscale-[0.5]" : ""
      } ${className}`}
    >
      <div className="aspect-square overflow-hidden relative">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <span className="bg-red-600 text-white px-4 py-2 font-bold rounded-lg shadow-xl uppercase tracking-wider transform -rotate-12 border-2 border-white">
              Out of Stock
            </span>
          </div>
        )}

        {badge && !isOutOfStock && (
          <div className="absolute top-2 right-2 z-10">
            <span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded shadow-md">
              {badge}
            </span>
          </div>
        )}
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className={compact ? "p-4" : "p-6"}>
        {category && (
          <p className="text-sm text-muted-foreground mb-2">{category}</p>
        )}
        <h3
          className={`font-semibold mb-2 line-clamp-2 ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          {name}
        </h3>

        {/* Highlight Tags */}
        {highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded border border-green-200 dark:border-green-700"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        {/* Ratings */}
        {!compact && (rating > 0 || reviews > 0) && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(Math.round(rating))].map((_, i) => (
              <span key={i} className="text-yellow-500">
                ★
              </span>
            ))}
            {reviews > 0 && (
              <span className="text-sm text-muted-foreground ml-1">
                ({reviews} reviews)
              </span>
            )}
          </div>
        )}

        <p
          className={`font-bold text-green-600 mb-${compact ? "3" : "4"} ${
            compact ? "text-lg" : "text-2xl"
          }`}
        >
          {price}
        </p>

        {compact ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(e);
            }}
            disabled={isOutOfStock}
            className={`w-full ${
              isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 text-white shadow-sm font-bold"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to cart"}
          </Button>
        ) : isOutOfStock ? (
          <Button
            disabled
            className="w-full bg-gray-400 cursor-not-allowed font-bold h-10 shadow-sm"
          >
            Sold Out
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onViewDetails}
              variant="outline"
              className="w-full sm:flex-1 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 text-xs sm:text-sm px-2 h-8 sm:h-10"
            >
              View Details
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(e);
              }}
              className="w-full sm:flex-1 bg-green-700 hover:bg-green-800 text-white font-bold text-xs sm:text-sm px-2 h-8 sm:h-10 shadow-sm"
            >
              Add to cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
