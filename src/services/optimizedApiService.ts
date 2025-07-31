// Simplified optimized API service to avoid type complexity issues
class OptimizedApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  async getClientes(tenantId?: string) {
    return [];
  }

  async getPrestadores(tenantId?: string, ativos = true) {
    return [];
  }

  async getServicos(tenantId?: string, ativos = true) {
    return [];
  }

  async getVendas(
    tenantId?: string, 
    page = 1, 
    limit = 20,
    dateRange?: { start: string; end: string }
  ) {
    return [];
  }

  async getAgendamentos(
    tenantId?: string,
    page = 1,
    limit = 20,
    status?: string
  ) {
    return [];
  }

  clearCache(pattern?: string) {
    this.cache.clear();
  }

  invalidateCache(table: string) {
    this.clearCache(table);
  }

  async prefetchCriticalData(tenantId: string) {
    // No-op for now
  }
}

export const optimizedApiService = new OptimizedApiService();