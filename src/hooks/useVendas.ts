
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Venda = Tables<"vendas">;
type NovaVenda = TablesInsert<"vendas">;
type VendaServico = Tables<"vendas_servicos">;
type NovoVendaServico = Omit<TablesInsert<"vendas_servicos">, "venda_id">;

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

export function useCreateVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venda, servicos }: { venda: NovaVenda; servicos: NovoVendaServico[] }) => {
      const { data: vendaData, error: vendaError } = await supabase
        .from("vendas")
        .insert([venda])
        .select()
        .single();
      
      if (vendaError) throw vendaError;

      // Adicionar os serviços à venda
      const servicosComVenda = servicos.map(servico => ({
        ...servico,
        venda_id: vendaData.id
      }));

      const { data: servicosData, error: servicosError } = await supabase
        .from("vendas_servicos")
        .insert(servicosComVenda)
        .select();
      
      if (servicosError) throw servicosError;

      return { venda: vendaData, servicos: servicosData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
    },
  });
}
