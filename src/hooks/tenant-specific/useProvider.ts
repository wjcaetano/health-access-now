
// Simplified provider hooks to avoid type complexity issues
export function useProviderData() {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}

export function useProviderMetrics() {
  return {
    data: {
      totalGuias: 0,
      guiasPendentes: 0,
      faturamentoMensal: 0,
      servicosAtivos: 0
    },
    loading: false,
    error: null
  };
}

export function useProviderOperations() {
  return {
    updateAvailability: {
      mutate: () => {},
      isLoading: false
    }
  };
}
