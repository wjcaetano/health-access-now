
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Cliente = Tables<"clientes">;
export type NovoCliente = TablesInsert<"clientes">;

export const clientesService = {
  async fetchClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("data_cadastro", { ascending: false });
    
    if (error) throw error;
    return data as Cliente[];
  },

  async createCliente(cliente: NovoCliente): Promise<Cliente> {
    const { data, error } = await supabase
      .from("clientes")
      .insert([cliente])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCliente(id: string, updates: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from("clientes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from("clientes")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};
