import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Jarak dari bottom untuk trigger load (dalam pixel)
  enabled?: boolean; // Apakah infinite scroll aktif
}

export const useInfiniteScroll = (options: UseInfiniteScrollOptions = {}) => {
  const { threshold = 200, enabled = true } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const setupObserver = useCallback((onLoadMore: () => void) => {
    if (!enabled) return;

    // Cleanup observer sebelumnya
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);
          // Simulasi delay untuk loading (bisa dihapus jika tidak perlu)
          setTimeout(() => {
            onLoadMore();
            setIsLoading(false);
          }, 300);
        }
      },
      {
        rootMargin: `${threshold}px`,
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [threshold, enabled, isLoading, hasMore]);

  const reset = useCallback(() => {
    setHasMore(true);
    setIsLoading(false);
  }, []);

  const stop = useCallback(() => {
    setHasMore(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    isLoading,
    hasMore,
    setHasMore,
    loadMoreRef,
    setupObserver,
    reset,
    stop,
  };
};
