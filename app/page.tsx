"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import { Leaf, Users } from "lucide-react";
import { config } from "@/config/site";
import {
  Search,
  Apple,
  Sprout,
  Droplet,
  Package,
  TrendingUp,
  CheckCircle,
  MapPin,
  Weight,
  Award,
  BadgeCheck,
} from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { useState, useMemo, useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { trustMetricsData } from "@/lib/trust-metrics-data";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";

export default function Home() {
  const { searchQuery } = useSearch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  // Handle hash scroll on mount
  useEffect(() => {
    // Small timeout to allow layout to stabilize
    const timeoutId = setTimeout(() => {
      if (window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  // Map frontend categories to database category codes
  const categoryMap: Record<string, string> = {
    All: "",
    Plants: "arecanut-plants",
    Tools: "tools",
    Fertilizers: "fertilizers",
  };

  const categories = ["All", "Plants", "Tools", "Fertilizers"];
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const MAX_FEATURED_PRODUCTS = 50;

  // Fetch products from API with pagination
  const { products, loading, error, totalProducts, hasMore, loadMore } =
    useProducts({
      initialLimit: 12,
      sort: "sales",
      search: searchQuery,
      category: categoryMap[activeCategory],
    });

  // Filter is now handled by the API, but we keep this for client-side search highlighting
  const displayProducts = useMemo(
    () => products.slice(0, MAX_FEATURED_PRODUCTS),
    [products]
  );

  const hasReachedFeatureLimit = products.length >= MAX_FEATURED_PRODUCTS;
  const hasMoreWithinLimit = hasMore && !hasReachedFeatureLimit;

  useEffect(() => {
    if (!hasMoreWithinLimit || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    const node = loadMoreRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, [hasMoreWithinLimit, loadMore, loading]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner with Image */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-banner.png)" }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full container px-4 md:px-6 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              India&apos;s First Online Arecanut Plant Store
            </h1>
            <p className="text-lg md:text-xl mb-6 text-white/90">
              We provide agricultural plants and make it easily accessible for
              everyone !!
            </p>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm md:text-base text-white/95">
                  Best prices for arecanut farmers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm md:text-base text-white/95">
                  Direct buyer connections
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm md:text-base text-white/95">
                  Fast payments
                </span>
              </div>
            </div>

            {/* Primary and Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 shadow-lg"
              >
                <Link href="/arecanut">Shop Arecanut Plants</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm font-medium px-8"
              >
                <Link href="/sell">Sell Your Arecanut</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Why Farmers Trust ArecaMart */}
      <section className="w-full py-8 bg-green-50 dark:bg-green-950/30 border-y border-green-100 dark:border-green-900">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {trustMetricsData.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustMetricsData.metrics.map((metric) => {
              // Icon mapping
              const IconComponent =
                metric.icon === "users"
                  ? Users
                  : metric.icon === "map-pin"
                  ? MapPin
                  : metric.icon === "weight"
                  ? Weight
                  : metric.icon === "badge-check"
                  ? BadgeCheck
                  : Award;

              // Color mapping
              const colorClasses = {
                bg:
                  metric.color === "green"
                    ? "bg-green-100 dark:bg-green-900"
                    : metric.color === "blue"
                    ? "bg-blue-100 dark:bg-blue-900"
                    : metric.color === "orange"
                    ? "bg-orange-100 dark:bg-orange-900"
                    : "bg-purple-100 dark:bg-purple-900",
                text:
                  metric.color === "green"
                    ? "text-green-600 dark:text-green-400"
                    : metric.color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : metric.color === "orange"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-purple-600 dark:text-purple-400",
              };

              return (
                <div
                  key={metric.id}
                  className="flex flex-col items-center text-center"
                >
                  <div className={`p-4 ${colorClasses.bg} rounded-full mb-3`}>
                    <IconComponent className={`h-8 w-8 ${colorClasses.text}`} />
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-bold ${colorClasses.text} mb-1`}
                  >
                    {metric.displayValue}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="w-full py-8 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/arecanut"
              className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-center">Arecanut Plants</h3>
            </Link>

            <Link
              href="/fertilizers"
              className="flex flex-col items-center p-6 bg-orange-50 dark:bg-orange-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full mb-3">
                <Sprout className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-center">Fertilizers</h3>
            </Link>

            <Link
              href="/fertilizers"
              className="flex flex-col items-center p-6 bg-red-50 dark:bg-red-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full mb-3">
                <Droplet className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-semibold text-center">Pesticides</h3>
            </Link>

            <Link
              href="/farm-accessories"
              className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-center">Farm Tools</h3>
            </Link>

            <Link
              href="/sell"
              className="flex flex-col items-center p-6 bg-yellow-50 dark:bg-yellow-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-3">
                <TrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="font-semibold text-center">Sell Produce</h3>
            </Link>

            <Link
              href="/marketRates"
              className="flex flex-col items-center p-6 bg-purple-50 dark:bg-purple-950 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-3">
                <Apple className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-center">Market Rates</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* Featured Products */}
      <section
        id="featured-products"
        className="w-full py-8 bg-background scroll-mt-28"
      >
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/arecanut" className="text-green-600 hover:underline">
              View all →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Search Results Info */}
          {searchQuery && !loading && (
            <div className="mb-4 text-sm text-muted-foreground">
              {totalProducts} result{totalProducts !== 1 ? "s" : ""} for "
              {searchQuery}"
            </div>
          )}

          {/* Products Grid */}
          {!loading || products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={`₹${product.price.toLocaleString()}`}
                    image={product.image_url || "/products/placeholder.png"}
                    category={product.categories.name}
                    rating={product.rating || 0}
                    reviews={product.review_count || 0}
                    badge={product.badge || undefined}
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

              {/* Lazy load sentinel */}
              {hasMoreWithinLimit && (
                <div
                  ref={loadMoreRef}
                  className="h-10 flex items-center justify-center"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  )}
                </div>
              )}

              {/* End-of-list messaging */}
              {!loading && !error && (!hasMore || hasReachedFeatureLimit) && (
                <div className="mt-10 text-center space-y-3 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {totalProducts <= MAX_FEATURED_PRODUCTS ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full mb-1">
                        <BadgeCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-lg font-bold text-green-800 dark:text-green-200">
                        You've seen them all!
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>
                          All {totalProducts || displayProducts.length} local
                          products have been viewed.
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-1">
                        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          More products are waiting!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          We've shown you the top {MAX_FEATURED_PRODUCTS}{" "}
                          featured items. Browse the full shop for more
                          varieties.
                        </p>
                      </div>
                      <Button
                        asChild
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 mt-2"
                      >
                        <Link href="/arecanut">View All Products →</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}

          {/* No Products Found */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sell & Market Prices Row */}
      <section className="w-full py-8 bg-green-50 dark:bg-green-950/30">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sell Your Arecanut */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Sell Your Arecanut
              </h2>
              <p className="text-green-50 mb-6">
                Get the best prices for your harvest. Connect directly with
                verified buyers across India.
              </p>
              <Link href="/sell">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm"
                >
                  Start Selling Now →
                </Button>
              </Link>
            </div>

            {/* Check Market Prices */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Check Market Prices
              </h2>
              <p className="text-blue-50 mb-6">
                Stay updated with real-time arecanut prices across different
                markets and grades.
              </p>
              <Link href="/marketRates">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/50 backdrop-blur-sm"
                >
                  View Market Rates →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About ArecaMart Band */}
      <section className="w-full py-8 bg-green-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/about/farm-story.png"
            alt="Arecanut Farm Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img
                  src="/about/farm-story.png"
                  alt="Farmers in Arecanut Plantation"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-green-800/80 rounded-full text-green-300 text-sm font-medium mb-4 backdrop-blur-sm border border-green-700">
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Built for Arecanut Farmers, <br />
                <span className="text-green-400">by Arecanut Farmers</span>
              </h2>
              <p className="text-lg text-green-100 mb-6 leading-relaxed">
                We understand the hard work that goes into every harvest.
                ArecaMart was born from a desire to empower our farming
                community with better market access, quality inputs, and fair
                prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Users className="h-5 w-5 text-green-400" />
                  <span className="font-medium">Community First</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <Leaf className="h-5 w-5 text-green-400" />
                  <span className="font-medium">Sustainable Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Help & Support Section */}
      <section className="w-full py-8 bg-green-50 dark:bg-green-950/30 border-t border-green-100 dark:border-green-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Help?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Our support team is here to assist you. Reach out via call,
              WhatsApp, or visit our help center.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl">
              {/* Call Support */}
              <a
                href={`tel:+${config.supportPhone}`}
                className="flex-1 flex items-center justify-center gap-4 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors min-h-[120px]"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base mb-1">Call Us</div>
                  <div className="text-green-600 dark:text-green-400 font-bold text-lg whitespace-nowrap">
                    +{config.supportPhone}
                  </div>
                </div>
              </a>

              {/* WhatsApp Support */}
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-4 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors min-h-[120px]"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base mb-1">WhatsApp</div>
                  <div className="text-green-600 dark:text-green-400 font-bold text-lg whitespace-nowrap">
                    +{config.whatsappNumber}
                  </div>
                </div>
              </a>

              {/* Help Center */}
              <Link
                href="/help"
                className="flex-1 flex items-center justify-center gap-4 bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors min-h-[120px]"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full flex-shrink-0">
                  <svg
                    className="h-8 w-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-base mb-1">
                    Help Center
                  </div>
                  <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                    Visit FAQs
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        product={
          selectedProduct
            ? {
                ...selectedProduct,
                image: selectedProduct.image_url || "/products/placeholder.png",
                category: selectedProduct.categories.name,
                reviews: selectedProduct.review_count || 0,
                rating: selectedProduct.rating || 0,
                price: `₹${selectedProduct.price.toLocaleString()}`,
                description: selectedProduct.description || undefined,
              }
            : null
        }
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          if (selectedProduct) {
            addToCart(selectedProduct);
            setSelectedProduct(null);
          }
        }}
      />
    </div>
  );
}
