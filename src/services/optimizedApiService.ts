import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

class OptimizedApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private maxCacheSize = 100;
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  private getCacheKey(table: string, filters?: Record<string, any>) {
    return `${table}_${JSON.stringify(filters || {})}`;
  }

  private setCache(key: string, data: any, ttl = this.defaultTTL) {
    // Limpar cache se atingir o limite
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  // Método otimizado para buscar dados com cache
  async fetchWithCache<T>(
    table: string,
    query: any,
    filters?: Record<string, any>,
    ttl?: number
  ): Promise<T[]> {
    const cacheKey = this.getCacheKey(table, filters);
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await query;
    
    if (error) throw error;
    
    this.setCache(cacheKey, data, ttl);
    return data || [];
  }

  // Buscar clientes com cache otimizado
  async getClientes(tenantId?: string) {
    let query = supabase
      .from("clientes")
      .select("*")
      .order("data_cadastro", { ascending: false });

    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }

    return this.fetchWithCache<Tables<"clientes">>(
      "clientes",
      query,
      { tenantId },
      10 * 60 * 1000 // 10 minutos para clientes
    );
  }

  // Buscar prestadores com cache otimizado
  async getPrestadores(tenantId?: string, ativos = true) {
    let query = supabase
      .from("prestadores")
      .select("*")
      .order("data_cadastro", { ascending: false });

    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
    
    if (ativos) {
      query = query.eq("ativo", true);
    }

    return this.fetchWithCache<Tables<"prestadores">>(
      "prestadores",
      query,
      { tenantId, ativos },
      10 * 60 * 1000
    );
  }

  // Buscar serviços com cache otimizado
  async getServicos(tenantId?: string, ativos = true) {
    let query = supabase
      .from("servicos")
      .select("*")
      .order("nome");

    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }
    
    if (ativos) {
      query = query.eq("ativo", true);
    }

    return this.fetchWithCache<Tables<"servicos">>(
      "servicos",
      query,
      { tenantId, ativos },
      15 * 60 * 1000 // 15 minutos para serviços
    );
  }

  // Buscar vendas com paginação otimizada
  async getVendas(
    tenantId?: string, 
    page = 1, 
    limit = 20,
    dateRange?: { start: string; end: string }
  ) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from("vendas")
      .select(`
        *,
        clientes!inner(id, nome, cpf),
        vendas_servicos!inner(
          *,
          servicos!inner(nome, categoria),
          prestadores!inner(nome)
        )
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }

    if (dateRange) {
      query = query
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);
    }

    return this.fetchWithCache(
      "vendas",
      query,
      { tenantId, page, limit, dateRange },
      2 * 60 * 1000 // 2 minutos para vendas
    );
  }

  // Buscar agendamentos com paginação
  async getAgendamentos(
    tenantId?: string,
    page = 1,
    limit = 20,
    status?: string
  ) {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from("agendamentos")
      .select(`
        *,
        clientes!inner(nome, cpf, telefone),
        servicos!inner(nome, categoria),
        prestadores!inner(nome, tipo)
      `)
      .order("data_agendamento", { ascending: false })
      .range(offset, offset + limit - 1);

    if (tenantId) {
      query = query.eq("tenant_id", tenantId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    return this.fetchWithCache(
      "agendamentos",
      query,
      { tenantId, page, limit, status },
      3 * 60 * 1000
    );
  }

  // Limpar cache específico
  clearCache(pattern?: string) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // Invalidar cache após operações de escrita
  invalidateCache(table: string) {
    this.clearCache(table);
  }

  // Método para pre-fetch de dados críticos
  async prefetchCriticalData(tenantId: string) {
    // Buscar dados críticos em paralelo
    await Promise.all([
      this.getClientes(tenantId),
      this.getPrestadores(tenantId),
      this.getServicos(tenantId)
    ]);
  }
}

export const optimizedApiService = new OptimizedApiService();