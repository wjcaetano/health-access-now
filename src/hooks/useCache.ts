
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options; // Default 5 minutes
  
  const [cache, setCache] = useLocalStorage<Record<string, CacheItem<T>>>('app-cache', {});
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const isExpired = useCallback((item: CacheItem<T>) => {
    return Date.now() > item.expiresAt;
  }, []);

  const isStale = useCallback((item: CacheItem<T>) => {
    // Consider stale after 50% of TTL has passed
    return Date.now() > (item.timestamp + ttl * 0.5);
  }, [ttl]);

  const fetchData = useCallback(async (useStale = false) => {
    const cached = cache[key];
    
    // If we have cached data and it's not expired, use it
    if (cached && !isExpired(cached)) {
      if (!useStale || !isStale(cached)) {
        setData(cached.data);
        return cached.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      const newCacheItem: CacheItem<T> = {
        data: result,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      };

      setCache(prev => ({
        ...prev,
        [key]: newCacheItem
      }));

      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // If we have stale data and staleWhileRevalidate is enabled, use it
      if (cached && staleWhileRevalidate) {
        setData(cached.data);
        return cached.data;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, cache, setCache, isExpired, isStale, staleWhileRevalidate]);

  const invalidate = useCallback(() => {
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[key];
      return newCache;
    });
    setData(null);
  }, [key, setCache]);

  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    const cached = cache[key];
    
    if (cached && !isExpired(cached)) {
      setData(cached.data);
      
      // If stale, fetch in background
      if (staleWhileRevalidate && isStale(cached)) {
        fetchData(true);
      }
    } else {
      fetchData();
    }
  }, [key]); // Only depend on key to avoid infinite loops

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}

// Cache management utilities
export const cacheUtils = {
  clear: () => {
    localStorage.removeItem('app-cache');
  },
  
  getSize: () => {
    const cache = localStorage.getItem('app-cache');
    return cache ? new Blob([cache]).size : 0;
  },
  
  cleanup: (maxAge = 24 * 60 * 60 * 1000) => { // Default 24 hours
    const cache = JSON.parse(localStorage.getItem('app-cache') || '{}');
    const now = Date.now();
    const cleaned = Object.fromEntries(
      Object.entries(cache).filter(([, item]: [string, any]) => 
        now - item.timestamp < maxAge
      )
    );
    localStorage.setItem('app-cache', JSON.stringify(cleaned));
  }
};
