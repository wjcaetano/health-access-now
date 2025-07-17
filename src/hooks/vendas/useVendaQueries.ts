
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVendas() {
  return useQuery({
    queryKey: ["vendas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(`
          *,
          clientes (
            id,
            nome,
            cpf
          ),
          vendas_servicos (
            *,
            servicos (
              nome,
              categoria
            ),
            prestadores (
              nome
            )
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

export function useVendasPorCliente(clienteId: string) {
  return useQuery({
    queryKey: ["vendas", "cliente", clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendas")
        .select(`
          *,
          vendas_servicos (
            *,
            servicos (
              nome,
              categoria
            ),
            prestadores (
              nome
            )
          )
        `)
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!clienteId,
  });
}
