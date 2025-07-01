
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Prestador = Tables<"prestadores">;
export type NovoPrestador = TablesInsert<"prestadores">;

export const prestadoresService = {
  async fetchPrestadores(): Promise<Prestador[]> {
    const { data, error } = await supabase
      .from("prestadores")
      .select("*")
      .order("data_cadastro", { ascending: false });
    
    if (error) throw error;
    return data as Prestador[];
  },

  async createPrestador(prestador: NovoPrestador): Promise<Prestador> {
    const { data, error } = await supabase
      .from("prestadores")
      .insert([prestador])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePrestador(id: string, updates: Partial<Prestador>): Promise<Prestador> {
    const { data, error } = await supabase
      .from("prestadores")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePrestador(id: string): Promise<void> {
    const { error } = await supabase
      .from("prestadores")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
  }
};
