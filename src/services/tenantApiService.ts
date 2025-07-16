
import { supabase } from "@/integrations/supabase/client";

export class TenantApiService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  // Clientes segregados por tenant
  async getClientes(filters?: any) {
    let query = supabase
      .from("clientes")
      .select("*")
      .eq("tenant_id", this.tenantId);

    if (filters?.search) {
      query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    return query.order("created_at", { ascending: false });
  }

  async createCliente(clienteData: any) {
    return supabase
      .from("clientes")
      .insert([{ ...clienteData, tenant_id: this.tenantId }])
      .select()
      .single();
  }

  // Prestadores segregados por tenant
  async getPrestadores(filters?: any) {
    let query = supabase
      .from("prestadores")
      .select("*")
      .eq("tenant_id", this.tenantId);

    if (filters?.tipo) {
      query = query.eq("tipo", filters.tipo);
    }

    if (filters?.ativo !== undefined) {
      query = query.eq("ativo", filters.ativo);
    }

    return query.order("created_at", { ascending: false });
  }

  async createPrestador(prestadorData: any) {
    return supabase
      .from("prestadores")
      .insert([{ ...prestadorData, tenant_id: this.tenantId }])
      .select()
      .single();
  }

  // Serviços segregados por tenant
  async getServicos(filters?: any) {
    let query = supabase
      .from("servicos")
      .select(`
        *,
        prestador:prestadores(nome, tipo)
      `)
      .eq("tenant_id", this.tenantId);

    if (filters?.categoria) {
      query = query.eq("categoria", filters.categoria);
    }

    if (filters?.ativo !== undefined) {
      query = query.eq("ativo", filters.ativo);
    }

    return query.order("created_at", { ascending: false });
  }

  // Vendas segregadas por tenant
  async getVendas(filters?: any) {
    let query = supabase
      .from("vendas")
      .select(`
        *,
        cliente:clientes(nome, cpf),
        vendas_servicos:vendas_servicos(
          *,
          servico:servicos(nome),
          prestador:prestadores(nome)
        )
      `)
      .eq("tenant_id", this.tenantId);

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.dataInicio && filters?.dataFim) {
      query = query.gte("created_at", filters.dataInicio)
                  .lte("created_at", filters.dataFim);
    }

    return query.order("created_at", { ascending: false });
  }

  // Métricas agregadas por tenant
  async getMetricas(periodo?: { inicio: string; fim: string }) {
    const promises = [
      this.getClientes(),
      this.getVendas(),
      this.getPrestadores({ ativo: true }),
      this.getServicos({ ativo: true })
    ];

    const [clientes, vendas, prestadores, servicos] = await Promise.all(promises);

    return {
      totalClientes: clientes.data?.length || 0,
      totalVendas: vendas.data?.length || 0,
      faturamentoTotal: vendas.data?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0,
      prestadoresAtivos: prestadores.data?.length || 0,
      servicosAtivos: servicos.data?.length || 0,
      ticketMedio: vendas.data?.length ? 
        (vendas.data.reduce((sum, v) => sum + Number(v.valor_total), 0) / vendas.data.length) : 0
    };
  }
}

// Factory para criar instância segregada por tenant
export const createTenantApiService = (tenantId: string) => {
  return new TenantApiService(tenantId);
};
