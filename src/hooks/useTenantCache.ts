
import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useLocalStorage } from './useLocalStorage';

interface TenantCacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  tenantId: string;
}

interface TenantCacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
}

export function useTenantCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: TenantCacheOptions = {}
) {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;
  const { currentTenant } = useTenant();
  
  const [cache, setCache] = useLocalStorage<Record<string, TenantCacheItem<T>>>(
    `tenant-cache-${currentTenant?.id || 'default'}`, 
    {}
  );
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tenantKey = currentTenant ? `${currentTenant.id}-${key}` : key;

  const isExpired = useCallback((item: TenantCacheItem<T>) => {
    return Date.now() > item.expiresAt;
  }, []);

  const isStale = useCallback((item: TenantCacheItem<T>) => {
    return Date.now() > (item.timestamp + ttl * 0.5);
  }, [ttl]);

  const fetchData = useCallback(async (useStale = false) => {
    if (!currentTenant) return null;

    const cached = cache[tenantKey];
    
    // Verificar se temos cache válido para este tenant
    if (cached && cached.tenantId === currentTenant.id && !isExpired(cached)) {
      if (!useStale || !isStale(cached)) {
        setData(cached.data);
        return cached.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      const newCacheItem: TenantCacheItem<T> = {
        data: result,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        tenantId: currentTenant.id
      };

      setCache(prev => ({
        ...prev,
        [tenantKey]: newCacheItem
      }));

      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      if (cached && staleWhileRevalidate && cached.tenantId === currentTenant.id) {
        setData(cached.data);
        return cached.data;
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [tenantKey, fetcher, ttl, cache, setCache, isExpired, isStale, staleWhileRevalidate, currentTenant]);

  const invalidate = useCallback(() => {
    setCache(prev => {
      const newCache = { ...prev };
      delete newCache[tenantKey];
      return newCache;
    });
    setData(null);
  }, [tenantKey, setCache]);

  const refresh = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  // Limpar cache quando trocar de tenant
  useEffect(() => {
    if (currentTenant) {
      const cached = cache[tenantKey];
      
      if (cached && cached.tenantId === currentTenant.id && !isExpired(cached)) {
        setData(cached.data);
        
        if (staleWhileRevalidate && isStale(cached)) {
          fetchData(true);
        }
      } else {
        fetchData();
      }
    }
  }, [currentTenant?.id, tenantKey]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}

// Utilitários para gerenciar cache por tenant
export const tenantCacheUtils = {
  clearTenantCache: (tenantId: string) => {
    localStorage.removeItem(`tenant-cache-${tenantId}`);
  },
  
  clearAllTenantCaches: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('tenant-cache-')) {
        localStorage.removeItem(key);
      }
    });
  },
  
  getTenantCacheSize: (tenantId: string) => {
    const cache = localStorage.getItem(`tenant-cache-${tenantId}`);
    return cache ? new Blob([cache]).size : 0;
  }
};
