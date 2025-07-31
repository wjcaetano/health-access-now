// Simplified royalties hooks - original implementation references non-existent tables
export function useRoyalties() {
  return {
    data: [],
    isLoading: false,
    error: null
  };
}

export function useRoyaltiesMetrics() {
  return {
    data: {
      totalRoyalties: 0,
      totalReceived: 0,
      totalPending: 0,
      totalOverdue: 0,
      percentualCobranca: 0,
      crescimentoMensal: 0
    },
    isLoading: false,
    error: null
  };
}

export function useConfirmPayment() {
  return {
    mutate: () => {},
    isLoading: false
  };
}

export function useSendReminder() {
  return {
    mutate: () => {},
    isLoading: false
  };
}

export function useRoyalty() {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}