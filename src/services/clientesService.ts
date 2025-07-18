
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Cliente = Tables<"clientes">;
export type NovoCliente = TablesInsert<"clientes">;

class ClientesService {
  private cache = new Map<string, Cliente[]>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async fetchClientes(): Promise<Cliente[]> {
    const cacheKey = 'all-clientes';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("data_cadastro", { ascending: false });
    
    if (error) throw error;
    
    const clientes = data as Cliente[];
    this.cache.set(cacheKey, clientes);
    
    // Clear cache after timeout
    setTimeout(() => {
      this.cache.delete(cacheKey);
    }, this.cacheTimeout);
    
    return clientes;
  }

  async createCliente(cliente: NovoCliente): Promise<Cliente> {
    const { data, error } = await supabase
      .from("clientes")
      .insert([cliente])
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidate cache
    this.cache.clear();
    
    return data;
  }

  async updateCliente(id: string, updates: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from("clientes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidate cache
    this.cache.clear();
    
    return data;
  }

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    // Invalidate cache
    this.cache.clear();
  }
}

export const clientesService = new ClientesService();
