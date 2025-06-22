
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hook dummy para manter compatibilidade, mas sem funcionalidade
export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      // Retorna array vazio já que não temos mais sistema de convites
      return [];
    },
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Função dummy - não faz nada
      throw new Error("Sistema de convites foi removido");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Função dummy - não faz nada
      throw new Error("Sistema de convites foi removido");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
  });
}
