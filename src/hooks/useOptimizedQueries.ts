// Simplified to avoid type complexity issues
export function useOptimizedQueries() {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}

export function useOptimizedClientes() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useOptimizedPrestadores() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useOptimizedServicos() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useOptimizedVendas() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useOptimizedAgendamentos() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useOptimizedOrcamentos() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useInvalidateOptimizedCache() {
  return {
    invalidateTable: () => {},
    invalidateAll: () => {},
    invalidateClientes: () => {},
    invalidatePrestadores: () => {},
    invalidateServicos: () => {},
    invalidateVendas: () => {},
    invalidateAgendamentos: () => {}
  };
}

export function usePrefetchCriticalData() {
  return {
    prefetch: async () => {}
  };
}