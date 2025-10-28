import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração global do React Query com estratégias de cache otimizadas
 * 
 * ESTRATÉGIAS DE CACHE:
 * - Dados estáticos (organizações, serviços): 10 minutos
 * - Dados semi-estáticos (prestadores, clientes): 5 minutos
 * - Dados dinâmicos (agendamentos, vendas): 1 minuto
 * - Dados em tempo real (notificações): sem cache (usar Realtime)
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configurações globais padrão
      staleTime: 60 * 1000, // 1 minuto
      gcTime: 5 * 60 * 1000, // 5 minutos (antigo cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// ============================================
// CONFIGURAÇÕES ESPECÍFICAS POR TIPO DE DADO
// ============================================

/**
 * Dados Estáticos - Mudam raramente
 * Cache: 10 minutos
 */
queryClient.setQueryDefaults(['organizacoes'], {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

queryClient.setQueryDefaults(['servicos'], {
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

/**
 * Dados Semi-Estáticos - Atualizam ocasionalmente
 * Cache: 5 minutos
 */
queryClient.setQueryDefaults(['prestadores'], {
  staleTime: 5 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
});

queryClient.setQueryDefaults(['clientes'], {
  staleTime: 5 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
});

queryClient.setQueryDefaults(['colaboradores'], {
  staleTime: 5 * 60 * 1000,
  gcTime: 15 * 60 * 1000,
});

/**
 * Dados Dinâmicos - Atualizam com frequência
 * Cache: 1 minuto
 */
queryClient.setQueryDefaults(['agendamentos'], {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

queryClient.setQueryDefaults(['vendas'], {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

queryClient.setQueryDefaults(['guias'], {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

queryClient.setQueryDefaults(['orcamentos'], {
  staleTime: 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

/**
 * Dados em Tempo Real - Sem cache
 * Usar Supabase Realtime ao invés de polling
 */
queryClient.setQueryDefaults(['notifications'], {
  staleTime: 0, // Sempre atualizar
  gcTime: 60 * 1000, // 1 minuto
});

/**
 * Dashboard - Cache curto para dados agregados
 */
queryClient.setQueryDefaults(['dashboard'], {
  staleTime: 2 * 60 * 1000, // 2 minutos
  gcTime: 5 * 60 * 1000,
});

queryClient.setQueryDefaults(['dashboard-stats'], {
  staleTime: 2 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
});

/**
 * Perfil do usuário - Cache médio
 */
queryClient.setQueryDefaults(['profile'], {
  staleTime: 3 * 60 * 1000, // 3 minutos
  gcTime: 10 * 60 * 1000,
});

queryClient.setQueryDefaults(['user-roles'], {
  staleTime: 5 * 60 * 1000, // 5 minutos - roles não mudam com frequência
  gcTime: 15 * 60 * 1000,
});

/**
 * Avaliações - Cache médio
 */
queryClient.setQueryDefaults(['avaliacoes'], {
  staleTime: 3 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
});
