
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { prestadoresService, Prestador, NovoPrestador } from "@/services/prestadoresService";
import { useToast } from "@/hooks/use-toast";

const QUERY_KEY = ["prestadores"];

export function usePrestadores() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: prestadoresService.fetchPrestadores,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreatePrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: prestadoresService.createPrestador,
    onSuccess: (newPrestador) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      
      toast({
        title: "Prestador cadastrado",
        description: `${newPrestador.nome} foi cadastrado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar prestador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Prestador> }) =>
      prestadoresService.updatePrestador(id, updates),
    onSuccess: (updatedPrestador) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      
      toast({
        title: "Prestador atualizado",
        description: `${updatedPrestador.nome} foi atualizado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar prestador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}

export function useDeletePrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: prestadoresService.deletePrestador,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      
      toast({
        title: "Prestador removido",
        description: "Prestador foi desativado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover prestador",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}
