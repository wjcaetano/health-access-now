import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePlatformConfig() {
  return useQuery({
    queryKey: ['platform-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('organizacoes')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutos (configurações mudam raramente)
  });
}

export function useUpdatePlatformConfig() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (updates: Partial<any>) => {
      // Buscar ID da config principal
      const { data: config } = await supabase
        .from('organizacoes')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();
      
      if (!config) {
        throw new Error('Configuração da plataforma não encontrada');
      }
      
      const { error } = await supabase
        .from('organizacoes')
        .update(updates)
        .eq('id', config.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-config'] });
      toast({
        title: 'Configurações atualizadas',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível atualizar as configurações.',
        variant: 'destructive',
      });
    },
  });
}
