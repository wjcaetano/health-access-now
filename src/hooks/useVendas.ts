
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type Venda = Tables<"vendas">;
type NovaVenda = TablesInsert<"vendas">;
type VendaServico = Tables<"vendas_servicos">;
type NovoVendaServico = Omit<TablesInsert<"vendas_servicos">, "venda_id">;

type CreateVendaResponse = {
  venda: Venda;
  servicos: VendaServico[];
  guias: any[];
  erro_guias?: string;
};

// Re-exportar hooks específicos para manter compatibilidade
export { 
  useVendas, 
  useVendasPorCliente,
  useCancelarVenda, 
  useEstornarVenda 
} from "./vendas";

export function useCreateVenda() {
  const queryClient = useQueryClient();
  
  return useMutation<CreateVendaResponse, Error, { venda: NovaVenda; servicos: NovoVendaServico[] }>({
    mutationFn: async ({ venda, servicos }) => {
      
      // 1. Criar a venda
      const { data: vendaData, error: vendaError } = await supabase
        .from("vendas")
        .insert([venda])
        .select()
        .single();
      
      if (vendaError) {
        throw vendaError;
      }

      // 2. Adicionar os serviços à venda
      const servicosComVenda = servicos.map(servico => ({
        ...servico,
        venda_id: vendaData.id
      }));

      const { data: servicosData, error: servicosError } = await supabase
        .from("vendas_servicos")
        .insert(servicosComVenda)
        .select(`
          *,
          servicos (nome, categoria),
          prestadores (nome, especialidades)
        `);
      
      if (servicosError) {
        throw servicosError;
      }

      // 3. Criar guias automaticamente
      const guiasParaCriar = servicosData.map((servico, index) => ({
        agendamento_id: vendaData.id,
        cliente_id: vendaData.cliente_id,
        servico_id: servico.servico_id,
        prestador_id: servico.prestador_id,
        valor: servico.valor,
        status: 'emitida' as const,
        codigo_autenticacao: `AG${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(3, '0')}`
      }));

      const { data: guiasData, error: guiasError } = await supabase
        .from("guias")
        .insert(guiasParaCriar)
        .select(`*, clientes (*), servicos (*), prestadores (*)`);

      if (guiasError) {
        return { 
          venda: vendaData, 
          servicos: servicosData, 
          guias: [],
          erro_guias: guiasError.message
        };
      }
      return { 
        venda: vendaData, 
        servicos: servicosData, 
        guias: guiasData || []
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}
