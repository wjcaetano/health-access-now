
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesService, Cliente, NovoCliente } from "@/services/clientesService";
import { useToast } from "@/hooks/use-toast";

// Hook otimizado para buscar clientes
export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: clientesService.fetchClientes,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para criar cliente com feedback automático
export function useCreateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientesService.createCliente,
    onSuccess: (newCliente) => {
      // Atualiza o cache otimisticamente
      queryClient.setQueryData<Cliente[]>(["clientes"], (old) => 
        old ? [newCliente, ...old] : [newCliente]
      );
      
      toast({
        title: "Cliente cadastrado",
        description: `${newCliente.nome} foi cadastrado com sucesso.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    },
  });
}

// Hook para atualizar cliente
export function useUpdateCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Cliente> }) =>
      clientesService.updateCliente(id, updates),
    onSuccess: (updatedCliente) => {
      // Atualiza o cache
      queryClient.setQueryData<Cliente[]>(["clientes"], (old) =>
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

// Hook para deletar cliente
export function useDeleteCliente() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: clientesService.deleteCliente,
    onSuccess: (_, deletedId) => {
      // Remove do cache
      queryClient.setQueryData<Cliente[]>(["clientes"], (old) =>
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
