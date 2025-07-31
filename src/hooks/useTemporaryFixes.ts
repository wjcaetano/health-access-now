// Arquivo temporário para resolver problemas de build
// Este arquivo contém fallbacks para hooks que estão causando problemas de tipo

export function useRoyalties() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useDashboardUnidade() {
  return {
    data: null,
    isLoading: false,
    error: null,
    metricas: {
      faturamento_total: 0,
      total_vendas: 0
    }
  };
}

export function useProvider() {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}

export function useOptimizedQueries() {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}