
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClientes } from '@/hooks/useClientes';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [
              {
                id: '1',
                nome: 'João Silva',
                email: 'joao@email.com',
                cpf: '123.456.789-00',
                telefone: '(11) 99999-9999'
              }
            ],
            error: null
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
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useClientes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch clientes successfully', async () => {
    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0]).toMatchObject({
      id: '1',
      nome: 'João Silva',
      email: 'joao@email.com'
    });
  });
});
