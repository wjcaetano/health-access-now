
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVendasRecentes, useVendasPorPeriodo } from '@/hooks/vendas/useVendaQueries';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          }))
        }))
      }))
    }))
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useVendaQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useVendasRecentes', () => {
    it('should return vendas recentes query', () => {
      const { result } = renderHook(() => useVendasRecentes(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useVendasPorPeriodo', () => {
    it('should return vendas por periodo query', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      
      const { result } = renderHook(() => useVendasPorPeriodo(startDate, endDate), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle disabled state when dates are invalid', () => {
      const { result } = renderHook(() => useVendasPorPeriodo(null, null), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
