import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePrestadoresPendentes() {
  return useQuery({
    queryKey: ['prestadores-pendentes'],
    queryFn: async () => {
      // Buscar prestadores com status 'aguardando_aprovacao' nos profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          nome,
          status,
          prestador_id,
          created_at,
          prestadores:prestadores (
            id,
            nome,
            tipo,
            cnpj,
            especialidades,
            telefone,
            email,
            endereco
          )
        `)
        .eq('nivel_acesso', 'prestador')
        .eq('status', 'aguardando_aprovacao')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      return profiles;
    },
    staleTime: 30 * 1000, // 30 segundos (atualizar frequentemente)
  });
}

export function useAprovarPrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prestadorId: string) => {
      // Atualizar status do profile para 'ativo'
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'ativo' })
        .eq('id', prestadorId);

      if (error) throw error;

      // TODO: Enviar email de aprovação (edge function)
      // await supabase.functions.invoke('send-email', {
      //   body: { tipo: 'aprovacao-prestador', destinatario: email }
      // });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador aprovado!',
        description: 'O prestador foi aprovado e pode acessar o sistema.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao aprovar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useReprovarPrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ prestadorId, motivo }: { prestadorId: string; motivo: string }) => {
      // Atualizar status para 'inativo' (reprovado)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'inativo',
        })
        .eq('id', prestadorId);

      if (error) throw error;

      // TODO: Enviar email de reprovação com motivo
      console.log('Motivo da reprovação:', motivo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador reprovado',
        description: 'O cadastro foi reprovado e o prestador foi notificado.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao reprovar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
