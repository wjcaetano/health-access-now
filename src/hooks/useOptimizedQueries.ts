import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { optimizedApiService } from "@/services/optimizedApiService";
import { useTenant } from "@/contexts/TenantContext";
import { useCallback } from "react";

// Hook otimizado para clientes
export function useOptimizedClientes() {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["clientes-optimized", currentTenant?.id],
    queryFn: () => optimizedApiService.getClientes(currentTenant?.id),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
  });
}

// Hook otimizado para prestadores
export function useOptimizedPrestadores(ativos = true) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["prestadores-optimized", currentTenant?.id, ativos],
    queryFn: () => optimizedApiService.getPrestadores(currentTenant?.id, ativos),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
  });
}

// Hook otimizado para serviços
export function useOptimizedServicos(ativos = true) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["servicos-optimized", currentTenant?.id, ativos],
    queryFn: () => optimizedApiService.getServicos(currentTenant?.id, ativos),
    staleTime: 15 * 60 * 1000, // 15 minutos (dados menos voláteis)
    gcTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
  });
}

// Hook otimizado para vendas com paginação
export function useOptimizedVendas(
  page = 1,
  limit = 20,
  dateRange?: { start: string; end: string }
) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["vendas-optimized", currentTenant?.id, page, limit, dateRange],
    queryFn: () => optimizedApiService.getVendas(currentTenant?.id, page, limit, dateRange),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
    placeholderData: (previousData) => previousData, // Manter dados anteriores
  });
}

// Hook otimizado para agendamentos com paginação
export function useOptimizedAgendamentos(
  page = 1,
  limit = 20,
  status?: string
) {
  const { currentTenant } = useTenant();
  
  return useQuery({
    queryKey: ["agendamentos-optimized", currentTenant?.id, page, limit, status],
    queryFn: () => optimizedApiService.getAgendamentos(currentTenant?.id, page, limit, status),
    staleTime: 3 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!currentTenant?.id,
    placeholderData: (previousData) => previousData,
  });
}

// Hook para invalidação inteligente de cache
export function useInvalidateOptimizedCache() {
  const queryClient = useQueryClient();
  
  const invalidateTable = useCallback((table: string) => {
    // Invalidar queries React Query
    queryClient.invalidateQueries({ 
      queryKey: [`${table}-optimized`],
      exact: false 
    });
    
    // Invalidar cache do serviço
    optimizedApiService.invalidateCache(table);
  }, [queryClient]);

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
    optimizedApiService.clearCache();
  }, [queryClient]);

  return {
    invalidateTable,
    invalidateAll,
    invalidateClientes: () => invalidateTable("clientes"),
    invalidatePrestadores: () => invalidateTable("prestadores"),
    invalidateServicos: () => invalidateTable("servicos"),
    invalidateVendas: () => invalidateTable("vendas"),
    invalidateAgendamentos: () => invalidateTable("agendamentos"),
  };
}

// Hook para pre-fetch inteligente
export function usePrefetchCriticalData() {
  const { currentTenant } = useTenant();
  const queryClient = useQueryClient();
  
  const prefetch = useCallback(async () => {
    if (!currentTenant?.id) return;
    
    // Pre-fetch dados críticos
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["clientes-optimized", currentTenant.id],
        queryFn: () => optimizedApiService.getClientes(currentTenant.id),
        staleTime: 10 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: ["prestadores-optimized", currentTenant.id, true],
        queryFn: () => optimizedApiService.getPrestadores(currentTenant.id, true),
        staleTime: 10 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: ["servicos-optimized", currentTenant.id, true],
        queryFn: () => optimizedApiService.getServicos(currentTenant.id, true),
        staleTime: 15 * 60 * 1000,
      }),
    ]);
  }, [currentTenant?.id, queryClient]);

  return { prefetch };
}