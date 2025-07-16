
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useClientes } from '@/hooks/useClientes';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useClientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch clientes successfully', async () => {
    const mockClientes = [
      { id: '1', nome: 'João Silva', email: 'joao@test.com', cpf: '123.456.789-00' },
      { id: '2', nome: 'Maria Santos', email: 'maria@test.com', cpf: '987.654.321-00' }
    ];

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: mockClientes,
        error: null
      })
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockClientes);
    expect(supabase.from).toHaveBeenCalledWith('clientes');
  });

  it('should handle error when fetching clientes', async () => {
    const mockError = { message: 'Database error' };

    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: null,
        error: mockError
      })
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });
});
