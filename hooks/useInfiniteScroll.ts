import { useEffect, useRef, RefObject } from "react";

interface UseInfiniteScrollOptions {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for infinite scroll functionality
 * Uses Intersection Observer API to detect when user scrolls near bottom
 *
 * @param onLoadMore - Callback function to load more items
 * @param hasMore - Whether there are more items to load
 * @param loading - Whether currently loading
 * @param threshold - Percentage of element visibility to trigger (0-1)
 * @param rootMargin - Margin around root element (e.g., "100px")
 * @returns Ref to attach to trigger element
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  threshold = 0.1,
  rootMargin = "100px",
}: UseInfiniteScrollOptions): RefObject<HTMLDivElement> {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't set up observer if no more items or currently loading
    if (!hasMore || loading) {
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        // Trigger load more when element is intersecting
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Store observer reference
    observerRef.current = observer;

    // Observe the trigger element
    const currentTrigger = triggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    // Cleanup function
    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, loading, threshold, rootMargin]);

  return triggerRef;
}
