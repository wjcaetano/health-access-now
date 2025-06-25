
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
        .select(`
          *,
          servicos (
            nome,
            categoria
          ),
          prestadores (
            nome,
            especialidades
          )
        `);
      
      if (servicosError) throw servicosError;

      // Criar guias para cada serviço
      const guias = servicosData.map(servico => ({
        cliente_id: vendaData.cliente_id,
        servico_id: servico.servico_id,
        prestador_id: servico.prestador_id,
        valor: servico.valor,
        status: 'emitida',
        codigo_autenticacao: `AG${Date.now()}${Math.floor(Math.random() * 1000)}`
      }));

      const { data: guiasData, error: guiasError } = await supabase
        .from("guias")
        .insert(guias)
        .select(`
          *,
          clientes (*),
          servicos (*),
          prestadores (*)
        `);

      if (guiasError) throw guiasError;

      return { venda: vendaData, servicos: servicosData, guias: guiasData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["orcamentos"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}

export function useCancelarVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      // Primeiro buscar os serviços da venda
      const { data: vendaServicos, error: servicosError } = await supabase
        .from("vendas_servicos")
        .select("servico_id")
        .eq("venda_id", vendaId);
      
      if (servicosError) throw servicosError;

      // Atualizar o status da venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'cancelada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Cancelar todas as guias relacionadas à venda
      if (vendaServicos && vendaServicos.length > 0) {
        const servicoIds = vendaServicos.map(vs => vs.servico_id);
        const { error: guiasError } = await supabase
          .from("guias")
          .update({ status: 'cancelada' })
          .in("servico_id", servicoIds);
          
        if (guiasError) throw guiasError;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}

export function useEstornarVenda() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      // Primeiro buscar os serviços da venda
      const { data: vendaServicos, error: servicosError } = await supabase
        .from("vendas_servicos")
        .select("servico_id")
        .eq("venda_id", vendaId);
      
      if (servicosError) throw servicosError;

      // Atualizar o status da venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'estornada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Estornar todas as guias relacionadas à venda
      if (vendaServicos && vendaServicos.length > 0) {
        const servicoIds = vendaServicos.map(vs => vs.servico_id);
        const { error: guiasError } = await supabase
          .from("guias")
          .update({ status: 'estornada' })
          .in("servico_id", servicoIds);
          
        if (guiasError) throw guiasError;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}
