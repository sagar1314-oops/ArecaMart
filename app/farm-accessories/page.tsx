"use client";

import { PageHero } from "@/components/PageHero";
import { ChevronDown, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useSearch } from "@/contexts/SearchContext";
import { useCart } from "@/contexts/CartContext";
import { config } from "@/config/site";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { InfiniteScrollTrigger } from "@/components/InfiniteScrollTrigger";

export default function FarmAccessoriesPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<
    "price-low" | "price-high" | "sales" | "newest"
  >("newest");
  const [filters, setFilters] = useState({
    priceRange: [] as string[],
  });
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const activeFilterCount = Object.values(filters).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const { searchQuery } = useSearch();
  const { addToCart } = useCart();

  // Fetch products dynamically
  const { products, loading, hasMore, loadMore, totalProducts } = useProducts({
    category: "tools",
    sort: sortBy === "sales" ? "sales" : undefined,
    search: searchQuery,
    initialLimit: 6,
  });

  const handleFilterChange = (
    category: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [],
    });
  };

  // Filter logic handled client-side
  const filteredProducts = products
    .filter((product) => {
      // Price range filter
      if (filters.priceRange.length > 0) {
        const matchesPriceRange = filters.priceRange.some((range) => {
          switch (range) {
            case "Under ₹1,000":
              return product.price < 1000;
            case "₹1,000 - ₹5,000":
              return product.price >= 1000 && product.price <= 5000;
            case "₹5,000 - ₹10,000":
              return product.price >= 5000 && product.price <= 10000;
            case "Above ₹10,000":
              return product.price > 10000;
            default:
              return true;
          }
        });
        if (!matchesPriceRange) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
        case "sales":
        default:
          return 0; // Handled by API
      }
    });

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <div className="container px-4 pt-4 md:px-6">
        <PageHero
          title="Farm Accessories"
          description="Explore our wide range of sprayers, cultivation tools, and safety gear designed for efficient Arecanut farming."
          imageSrc="/farm-accessories-hero-v2.jpg"
          imageAlt="Farm Accessories and Tools"
          backgroundPosition="right bottom"
          backgroundSize="auto"
        />
      </div>

      {/* Products Section */}
      <section className="w-full pb-8 pt-0 bg-green-50 dark:bg-green-950">
        <div className="container px-4 md:px-6">
          {searchQuery && (
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredProducts.length} result
              {filteredProducts.length !== 1 ? "s" : ""} for "{searchQuery}"
            </div>
          )}

          {/* Sticky Filter & Sort Bar */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-green-100 dark:border-green-900 mb-4 -mx-4 px-4 py-3 md:mx-0 md:rounded-lg md:border md:top-4">
            <div className="flex items-center justify-between gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-green-600 transition-colors"
                >
                  Sort:{" "}
                  {sortBy === "newest"
                    ? "Newest"
                    : sortBy === "price-low"
                    ? "Price: Low to High"
                    : sortBy === "price-high"
                    ? "Price: High to Low"
                    : "Best Selling"}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isSortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsSortDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-100 dark:border-green-900 py-1 z-20">
                      {[
                        { value: "newest", label: "Newest" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "sales", label: "Best Selling" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as any);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-green-900/20 ${
                            sortBy === option.value
                              ? "text-green-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 text-sm text-muted-foreground">
            Showing {filteredProducts.length} farm accessories
            {activeFilterCount > 0 && (
              <>
                {" · Filters: "}
                <span className="font-medium text-foreground">
                  {[...filters.priceRange].join(", ")}
                </span>
              </>
            )}
          </div>

          {/* Slide-out Filter Panel */}
          {isFilterPanelOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFilterPanelOpen(false)}
              />

              {/* Panel */}
              <div className="relative w-full md:max-w-xs bg-white dark:bg-gray-950 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-green-100 dark:border-green-900">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button
                    onClick={() => setIsFilterPanelOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Price Range</h4>
                    <div className="space-y-2">
                      {[
                        "Under ₹1,000",
                        "₹1,000 - ₹5,000",
                        "₹5,000 - ₹10,000",
                        "Above ₹10,000",
                      ].map((range) => (
                        <label
                          key={range}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.priceRange.includes(range)}
                            onChange={() =>
                              handleFilterChange("priceRange", range)
                            }
                            className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                          />
                          <span className="text-sm">{range}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-900/10">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={clearAllFilters}
                    >
                      Clear All
                    </Button>
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => setIsFilterPanelOpen(false)}
                    >
                      Show Results
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={`₹${product.price.toLocaleString()}`}
                image={product.image_url || "/products/placeholder.png"}
                rating={product.rating || 0}
                reviews={product.review_count || 0}
                highlights={[]}
                category={product.categories.name}
                isOutOfStock={product.is_out_of_stock ?? false}
                onViewDetails={() => setSelectedProduct(product)}
                onAddToCart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addToCart(product);
                }}
              />
            ))}
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`loading-${i}`}
                  className="bg-background rounded-2xl overflow-hidden border shadow-sm h-[400px] animate-pulse"
                >
                  <div className="h-48 bg-muted"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-6 bg-muted rounded w-20"></div>
                      <div className="h-10 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !hasMore && products.length > 0 && (
            <div className="text-center py-12 text-muted-foreground animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xl font-medium text-foreground mb-2">
                You've viewed all {totalProducts} products
              </p>
              <p className="text-base text-muted-foreground">
                Check back later for new arrivals!
              </p>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No farm accessories found matching your criteria
              </p>
            </div>
          )}

          <InfiniteScrollTrigger
            onIntersect={loadMore}
            isLoading={loading}
            hasMore={hasMore}
          />
        </div>
      </section>

      <ProductModal
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                image: selectedProduct.image_url || "/products/placeholder.png",
                price: `₹${selectedProduct.price.toLocaleString()}`,
                category: selectedProduct.categories.name,
                reviews: selectedProduct.review_count || 0,
                rating: selectedProduct.rating || 0,
                description: selectedProduct.description || undefined,
              }
            : null
        }
        onClose={closeModal}
        onAddToCart={() => {
          if (selectedProduct) {
            addToCart(selectedProduct);
          }
        }}
      />
    </div>
  );
}
