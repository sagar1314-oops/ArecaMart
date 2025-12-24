"use client";

import { useEffect, useRef } from "react";

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function InfiniteScrollTrigger({
  onIntersect,
  isLoading,
  hasMore,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [onIntersect, isLoading, hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={triggerRef} className="w-full py-8 text-center bg-transparent">
      {isLoading && (
        <div className="inline-flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  );
}
