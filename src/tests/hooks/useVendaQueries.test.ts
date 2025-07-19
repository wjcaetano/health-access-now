
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useVendas, useVendasPorCliente } from '@/hooks/vendas/useVendaQueries';
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

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useVendaQueries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useVendas', () => {
    it('should return vendas query', () => {
      const { result } = renderHook(() => useVendas(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeNull();
    });
  });

  describe('useVendasPorCliente', () => {
    it('should return vendas por cliente query', () => {
      const clienteId = 'test-cliente-id';
      
      const { result } = renderHook(() => useVendasPorCliente(clienteId), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('should handle disabled state when clienteId is empty', () => {
      const { result } = renderHook(() => useVendasPorCliente(''), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.isLoading).toBe(false);
    });
  });
});
