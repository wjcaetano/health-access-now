
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClientes, useCreateCliente, useUpdateCliente, useDeleteCliente } from '@/hooks/useClientes';
import { clientesService } from '@/services/clientesService';
import { useToast } from '@/hooks/use-toast';

// Mock dos serviços
jest.mock('@/services/clientesService');
jest.mock('@/hooks/use-toast');

const mockClientesService = clientesService as jest.Mocked<typeof clientesService>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useClientes', () => {
  const mockToast = jest.fn();

  beforeEach(() => {
    mockUseToast.mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
  });

  it('should fetch clientes successfully', async () => {
    const mockClientes = [
      { id: '1', nome: 'Cliente 1', email: 'cliente1@test.com', cpf: '123.456.789-01', telefone: '11999999999', id_associado: 'ASS001' },
      { id: '2', nome: 'Cliente 2', email: 'cliente2@test.com', cpf: '987.654.321-09', telefone: '11888888888', id_associado: 'ASS002' }
    ];

    mockClientesService.fetchClientes.mockResolvedValue(mockClientes);

    const { result } = renderHook(() => useClientes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockClientes);
    expect(mockClientesService.fetchClientes).toHaveBeenCalledTimes(1);
  });

  it('should create cliente with success toast', async () => {
    const newCliente = { nome: 'Novo Cliente', email: 'novo@test.com', cpf: '111.222.333-44', telefone: '11777777777', id_associado: 'ASS003' };
    const createdCliente = { ...newCliente, id: '3' };

    mockClientesService.createCliente.mockResolvedValue(createdCliente);

    const { result } = renderHook(() => useCreateCliente(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newCliente);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockClientesService.createCliente).toHaveBeenCalledWith(newCliente);
    expect(mockToast).toHaveBeenCalledWith({
      title: "Cliente cadastrado",
      description: `${createdCliente.nome} foi cadastrado com sucesso.`,
    });
  });
});
