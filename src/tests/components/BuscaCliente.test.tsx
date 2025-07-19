
import { render, waitFor } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BuscaCliente from '@/components/vendas/BuscaCliente';

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
    disabled: false,
  };

  it('deve renderizar o componente corretamente', () => {
    render(
      <BuscaCliente {...mockProps} />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByPlaceholderText(/digite o cpf ou nome/i)).toBeDefined();
    expect(screen.getByText(/buscar/i)).toBeDefined();
  });

  it('deve chamar onBuscar quando o botão é clicado', async () => {
    render(
      <BuscaCliente {...mockProps} />,
      { wrapper: createWrapper() }
    );

    const button = screen.getByText(/buscar/i);
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

  it('deve mostrar estado desabilitado quando necessário', () => {
    render(
      <BuscaCliente {...mockProps} disabled={true} />,
      { wrapper: createWrapper() }
    );

    const input = screen.getByPlaceholderText(/digite o cpf ou nome/i);
    const button = screen.getByText(/buscar/i);
    
    expect(input).toHaveProperty('disabled', true);
    expect(button).toHaveProperty('disabled', true);
  });
});
