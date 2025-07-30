
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Prestador = Tables<"prestadores">;
export type NovoPrestador = TablesInsert<"prestadores">;

class PrestadoresService {
  private cache = new Map<string, Prestador[]>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Bind methods to preserve context
  fetchPrestadores = async (): Promise<Prestador[]> => {
    const cacheKey = 'all-prestadores';
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from("prestadores")
      .select("*")
      .eq("ativo", true)
      .order("data_cadastro", { ascending: false });
    
    if (error) throw error;
    
    const prestadores = data as Prestador[];
    this.cache.set(cacheKey, prestadores);
    
    setTimeout(() => {
      this.cache.delete(cacheKey);
    }, this.cacheTimeout);
    
    return prestadores;
  }

  createPrestador = async (prestador: NovoPrestador): Promise<Prestador> => {
    const { data, error } = await supabase
      .from("prestadores")
      .insert([prestador])
      .select()
      .single();
    
    if (error) throw error;
    
    this.cache.clear();
    return data;
  }

  updatePrestador = async (id: string, updates: Partial<Prestador>): Promise<Prestador> => {
    const { data, error } = await supabase
      .from("prestadores")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    this.cache.clear();
    return data;
  }

  deletePrestador = async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("prestadores")
      .update({ ativo: false })
      .eq("id", id);
    
    if (error) throw error;
    
    this.cache.clear();
  }
}

export const prestadoresService = new PrestadoresService();
