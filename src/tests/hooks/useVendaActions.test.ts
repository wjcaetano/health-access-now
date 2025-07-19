
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCriarVenda, useCancelarVenda } from '@/hooks/vendas/useVendaActions';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

// Mock do useToast
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
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

describe('useVendaActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useCriarVenda', () => {
    it('should return criar venda mutation', () => {
      const { result } = renderHook(() => useCriarVenda(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('useCancelarVenda', () => {
    it('should return cancelar venda mutation', () => {
      const { result } = renderHook(() => useCancelarVenda(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
