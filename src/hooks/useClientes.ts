
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService, Cliente, NovoCliente } from "@/services/clientesService";
import { useToast } from "@/hooks/use-toast";

const QUERY_KEY = ["clientes"];

export function useClientes() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: clientesService.fetchClientes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientesService.createCliente,
    onMutate: async (newCliente) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previousClientes = queryClient.getQueryData<Cliente[]>(QUERY_KEY);
      
      const optimisticCliente = {
        ...newCliente,
        id: `temp-${Date.now()}`,
        data_cadastro: new Date().toISOString(),
      } as Cliente;
      
      queryClient.setQueryData<Cliente[]>(QUERY_KEY, (old) => 
        old ? [optimisticCliente, ...old] : [optimisticCliente]
      );
      
      return { previousClientes };
    },
    onSuccess: (newCliente) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      
      toast({
        title: "Cliente cadastrado",
        description: `${newCliente.nome} foi cadastrado com sucesso.`,
      });
    },
    onError: (error: Error, _newCliente, context) => {
      // Rollback optimistic update
      if (context?.previousClientes) {
        queryClient.setQueryData(QUERY_KEY, context.previousClientes);
      }
      
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Cliente> }) =>
      clientesService.updateCliente(id, updates),
    onSuccess: (updatedCliente) => {
      queryClient.setQueryData<Cliente[]>(QUERY_KEY, (old) =>
        old ? old.map(client => client.id === updatedCliente.id ? updatedCliente : client) : []
      );
      
      toast({
        title: "Cliente atualizado",
        description: `${updatedCliente.nome} foi atualizado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientesService.deleteCliente,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Cliente[]>(QUERY_KEY, (old) =>
        old ? old.filter(client => client.id !== deletedId) : []
      );
      
      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover cliente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}
