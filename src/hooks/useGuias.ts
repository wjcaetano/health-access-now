import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Re-export all guia hooks from specific files for backwards compatibility
export { 
  useGuias, 
  useGuiasPorStatus, 
  useGuiasProximasVencimento, 
  useGuiasPorPedido 
} from "@/hooks/guias/useGuiaQueries";

export { 
  useUpdateGuiaStatus, 
  useEstornarGuia 
} from "@/hooks/guias/useGuiaStatus";

// Keep existing hooks that weren't moved
export { useCancelamentoPedido, useBuscarGuiasRelacionadas } from "@/hooks/useCancelamentoPedido";

// Re-export utilities for backwards compatibility
export { isStatusTransitionAllowed, calcularDiasParaExpiracao } from "@/utils/guiaUtils";
export { GUIA_STATUS, STATUS_TRANSITIONS } from "@/types/guias";

// New hook for provider guias
export function useGuiasPrestador() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["guias-prestador", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // Buscar profile para pegar prestador_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("prestador_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.prestador_id) throw new Error("Prestador não encontrado");

      // Buscar guias do prestador
      const { data, error } = await supabase
        .from("guias")
        .select(`
          *,
          clientes:cliente_id (
            id,
            nome,
            cpf,
            telefone,
            email,
            id_associado
          ),
          servicos:servico_id (
            id,
            nome,
            categoria
          ),
          agendamentos:agendamento_id (
            id,
            data_agendamento,
            horario
          )
        `)
        .eq("prestador_id", profile.prestador_id)
        .order("data_emissao", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 segundos
  });
}

// New hook for client guias
export function useGuiasCliente() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["guias-cliente", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // Buscar profile para pegar cliente_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("cliente_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.cliente_id) throw new Error("Cliente não encontrado");

      // Buscar guias do cliente
      const { data, error } = await supabase
        .from("guias")
        .select(`
          *,
          prestadores:prestador_id (
            id,
            nome,
            tipo
          ),
          servicos:servico_id (
            id,
            nome,
            categoria,
            descricao
          ),
          agendamentos:agendamento_id (
            id,
            data_agendamento,
            horario
          )
        `)
        .eq("cliente_id", profile.cliente_id)
        .order("data_emissao", { ascending: false});

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 30 * 1000,
  });
}
