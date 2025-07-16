
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClientes } from '@/hooks/useClientes';
import { supabase } from '@/integrations/supabase/client';

// Mock do Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  }
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useClientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch clients successfully', async () => {
    const mockClientes = [
      { id: '1', nome: 'João Silva', email: 'joao@test.com', cpf: '123.456.789-00' },
      { id: '2', nome: 'Maria Santos', email: 'maria@test.com', cpf: '987.654.321-00' }
    ];

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        data: mockClientes,
        error: null
      })
    }));

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockClientes);
    });
  });
});
