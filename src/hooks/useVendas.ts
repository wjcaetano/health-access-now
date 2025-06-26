import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { useCancelarGuia, useEstornarGuia } from "@/hooks/useGuias";

type Venda = Tables<"vendas">;
type NovaVenda = TablesInsert<"vendas">;
type VendaServico = Tables<"vendas_servicos">;
type NovoVendaServico = Omit<TablesInsert<"vendas_servicos">, "venda_id">;

// Add proper type definition for the create venda response
type CreateVendaResponse = {
  venda: Venda;
  servicos: VendaServico[];
  guias: any[];
  erro_guias?: string;
};

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
  
  return useMutation<CreateVendaResponse, Error, { venda: NovaVenda; servicos: NovoVendaServico[] }>({
    mutationFn: async ({ venda, servicos }: { venda: NovaVenda; servicos: NovoVendaServico[] }) => {
      console.log('=== INICIANDO CRIAÇÃO DA VENDA ===');
      console.log('Dados da venda:', venda);
      console.log('Serviços a serem vinculados:', servicos);

      // 1. Criar a venda
      const { data: vendaData, error: vendaError } = await supabase
        .from("vendas")
        .insert([venda])
        .select()
        .single();
      
      if (vendaError) {
        console.error('Erro ao criar venda:', vendaError);
        throw vendaError;
      }

      console.log('✅ Venda criada com sucesso:', vendaData);

      // 2. Adicionar os serviços à venda
      const servicosComVenda = servicos.map(servico => ({
        ...servico,
        venda_id: vendaData.id
      }));

      console.log('Criando serviços da venda:', servicosComVenda);

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
      
      if (servicosError) {
        console.error('Erro ao criar serviços da venda:', servicosError);
        throw servicosError;
      }

      console.log('✅ Serviços da venda criados:', servicosData);

      // 3. Criar guias para cada serviço automaticamente
      console.log('=== INICIANDO CRIAÇÃO DAS GUIAS ===');
      
      const guiasParaCriar = servicosData.map((servico, index) => {
        const codigoAutenticacao = `AG${Date.now().toString().slice(-6)}${(index + 1).toString().padStart(3, '0')}`;
        
        const guia = {
          agendamento_id: vendaData.id, // Vinculando à venda
          cliente_id: vendaData.cliente_id,
          servico_id: servico.servico_id,
          prestador_id: servico.prestador_id,
          valor: servico.valor,
          status: 'emitida' as const,
          codigo_autenticacao: codigoAutenticacao
        };
        
        console.log(`Preparando guia ${index + 1}:`, guia);
        return guia;
      });

      console.log('Total de guias a serem criadas:', guiasParaCriar.length);

      const { data: guiasData, error: guiasError } = await supabase
        .from("guias")
        .insert(guiasParaCriar)
        .select(`
          *,
          clientes (*),
          servicos (*),
          prestadores (*)
        `);

      if (guiasError) {
        console.error('❌ ERRO ao criar guias:', guiasError);
        console.error('Detalhes do erro das guias:', guiasError);
        
        // Return with empty guides but inform the problem
        return { 
          venda: vendaData, 
          servicos: servicosData, 
          guias: [],
          erro_guias: guiasError.message
        };
      }

      console.log('✅ GUIAS CRIADAS COM SUCESSO!');
      console.log('Quantidade de guias criadas:', guiasData?.length || 0);
      console.log('Dados das guias:', guiasData);

      // Log detalhado de cada guia criada
      if (guiasData && guiasData.length > 0) {
        guiasData.forEach((guia, index) => {
          console.log(`Guia ${index + 1} criada:`, {
            id: guia.id,
            codigo: guia.codigo_autenticacao,
            cliente_id: guia.cliente_id,
            servico_id: guia.servico_id,
            prestador_id: guia.prestador_id,
            valor: guia.valor,
            status: guia.status
          });
        });
      }

      const resultado = { 
        venda: vendaData, 
        servicos: servicosData, 
        guias: guiasData || []
      };

      console.log('=== RESULTADO FINAL DA CRIAÇÃO ===');
      console.log('Venda ID:', resultado.venda.id);
      console.log('Quantidade de serviços:', resultado.servicos.length);
      console.log('Quantidade de guias:', resultado.guias.length);

      return resultado;
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
      console.log('Cancelando venda:', vendaId);
      
      // Primeiro buscar as guias relacionadas à venda
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) {
        console.error('Erro ao buscar guias da venda:', guiasError);
        throw guiasError;
      }

      // Cancelar todas as guias relacionadas que podem ser canceladas
      if (guiasRelacionadas && guiasRelacionadas.length > 0) {
        console.log('Cancelando guias relacionadas:', guiasRelacionadas);
        
        for (const guia of guiasRelacionadas) {
          if (['emitida', 'realizada', 'faturada'].includes(guia.status)) {
            try {
              await GuiasService.cancelarGuiaIndividual(guia.id);
            } catch (error) {
              console.error(`Erro ao cancelar guia ${guia.id}:`, error);
              // Continua com as outras guias mesmo se uma falhar
            }
          }
        }
      }

      // Atualizar o status da venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'cancelada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao cancelar venda:', error);
        throw error;
      }
      
      console.log('Venda cancelada com sucesso:', data);
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
  const { mutate: estornarGuia } = useEstornarGuia();
  
  return useMutation({
    mutationFn: async (vendaId: string) => {
      console.log('Estornando venda:', vendaId);
      
      // Primeiro buscar as guias relacionadas à venda
      const { data: guiasRelacionadas, error: guiasError } = await supabase
        .from("guias")
        .select("id, status")
        .eq("agendamento_id", vendaId);
      
      if (guiasError) {
        console.error('Erro ao buscar guias da venda:', guiasError);
        throw guiasError;
      }

      // Estornar todas as guias relacionadas que podem ser estornadas
      if (guiasRelacionadas && guiasRelacionadas.length > 0) {
        console.log('Estornando guias relacionadas:', guiasRelacionadas);
        
        for (const guia of guiasRelacionadas) {
          if (guia.status === 'paga') {
            try {
              await estornarGuia({ guiaId: guia.id, userType: 'unidade' });
            } catch (error) {
              console.error(`Erro ao estornar guia ${guia.id}:`, error);
              // Continua com as outras guias mesmo se uma falhar
            }
          }
        }
      }

      // Atualizar o status da venda
      const { data, error } = await supabase
        .from("vendas")
        .update({ status: 'estornada' })
        .eq("id", vendaId)
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao estornar venda:', error);
        throw error;
      }
      
      console.log('Venda estornada com sucesso:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      queryClient.invalidateQueries({ queryKey: ["guias"] });
    },
  });
}
