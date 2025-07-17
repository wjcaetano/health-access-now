
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BuscaCliente } from '@/components/vendas/BuscaCliente';

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

describe('BuscaCliente', () => {
  const mockProps = {
    termoBusca: '',
    setTermoBusca: vi.fn(),
    onBuscar: vi.fn(),
    loading: false,
  };

  it('deve renderizar o componente corretamente', () => {
    render(
      <BuscaCliente {...mockProps} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByPlaceholderText(/digite o cpf ou nome/i)).toBeInTheDocument();
    expect(screen.getByText(/buscar cliente/i)).toBeInTheDocument();
  });

  it('deve chamar onBuscar quando o botão é clicado', async () => {
    render(
      <BuscaCliente {...mockProps} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByText(/buscar cliente/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockProps.onBuscar).toHaveBeenCalled();
    });
  });

  it('deve atualizar o termo de busca', () => {
    render(
      <BuscaCliente {...mockProps} />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByPlaceholderText(/digite o cpf ou nome/i);
    fireEvent.change(input, { target: { value: 'João Silva' } });

    expect(mockProps.setTermoBusca).toHaveBeenCalledWith('João Silva');
  });

  it('deve mostrar loading quando necessário', () => {
    render(
      <BuscaCliente {...mockProps} loading={true} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText(/buscando/i)).toBeInTheDocument();
  });
});
