import { useState, useEffect, useCallback } from "react";
import { Product, ProductsApiResponse } from "@/types/product";

interface UseProductsOptions {
  initialLimit?: number;
  category?: string;
  search?: string;
  sort?: "sales" | "newest";
  tag?: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  loadMore: () => void;
  refresh: () => void;
}

export function useProducts({
  initialLimit = 8,
  category,
  search,
  sort,
  tag,
}: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit] = useState(initialLimit);

  const fetchProducts = useCallback(
    async (page: number, append = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          active: "true",
        });

        if (category && category !== "All") {
          params.append("category", category);
        }

        if (search) {
          params.append("search", search);
        }

        if (sort) {
          params.append("sort", sort);
        }

        if (tag) {
          params.append("tag", tag);
        }

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsApiResponse = await response.json();

        if (!data.success) {
          throw new Error(data.data?.toString() || "Failed to fetch products");
        }

        if (append) {
          setProducts((prev) => [...prev, ...data.data.products]);
        } else {
          setProducts(data.data.products);
        }

        setCurrentPage(data.data.pagination.page);
        setTotalPages(data.data.pagination.totalPages);
        setTotalProducts(data.data.pagination.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    },
    [category, search, limit, sort, tag]
  );

  // Initial fetch and when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      fetchProducts(currentPage + 1, true);
    }
  }, [currentPage, totalPages, loading, fetchProducts]);

  const refresh = useCallback(() => {
    setCurrentPage(1);
    fetchProducts(1, false);
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    hasMore: currentPage < totalPages,
    currentPage,
    totalPages,
    totalProducts,
    loadMore,
    refresh,
  };
}
