import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Avaliacao {
  id: string;
  cliente_id: string;
  prestador_id: string;
  guia_id: string;
  nota: number;
  comentario: string | null;
  resposta_prestador: string | null;
  created_at: string;
  updated_at: string;
  cliente?: { nome: string; };
  prestador?: { nome: string; };
}

export function useAvaliacoesPrestador(prestadorId: string) {
  return useQuery({
    queryKey: ['avaliacoes', 'prestador', prestadorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          cliente:clientes(nome),
          prestador:prestadores(nome)
        `)
        .eq('prestador_id', prestadorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Avaliacao[];
    },
    enabled: !!prestadorId
  });
}

export function useAvaliacoesCliente(clienteId: string) {
  return useQuery({
    queryKey: ['avaliacoes', 'cliente', clienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          cliente:clientes(nome),
          prestador:prestadores(nome)
        `)
        .eq('cliente_id', clienteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Avaliacao[];
    },
    enabled: !!clienteId
  });
}

export function useTodasAvaliacoes() {
  return useQuery({
    queryKey: ['avaliacoes', 'todas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          *,
          cliente:clientes(nome),
          prestador:prestadores(nome, media_avaliacoes, total_avaliacoes)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as Avaliacao[];
    }
  });
}

export function useCriarAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avaliacao: {
      cliente_id: string;
      prestador_id: string;
      guia_id: string;
      nota: number;
      comentario?: string;
    }) => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .insert(avaliacao)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
      queryClient.invalidateQueries({ queryKey: ['prestadores'] });
      toast.success('Avaliação enviada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar avaliação');
    }
  });
}

export function useResponderAvaliacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      avaliacaoId, 
      resposta 
    }: { 
      avaliacaoId: string; 
      resposta: string; 
    }) => {
      const { data, error } = await supabase
        .from('avaliacoes')
        .update({ resposta_prestador: resposta })
        .eq('id', avaliacaoId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['avaliacoes'] });
      toast.success('Resposta enviada com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao enviar resposta');
    }
  });
}

export function useEstatisticasAvaliacoes(prestadorId?: string) {
  return useQuery({
    queryKey: ['avaliacoes', 'estatisticas', prestadorId],
    queryFn: async () => {
      let query = supabase
        .from('avaliacoes')
        .select('nota');

      if (prestadorId) {
        query = query.eq('prestador_id', prestadorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const distribuicao = [0, 0, 0, 0, 0];
      data.forEach(av => {
        if (av.nota >= 1 && av.nota <= 5) {
          distribuicao[av.nota - 1]++;
        }
      });

      const totalAvaliacoes = data.length;
      const mediaGeral = totalAvaliacoes > 0
        ? data.reduce((sum, av) => sum + av.nota, 0) / totalAvaliacoes
        : 0;

      return {
        totalAvaliacoes,
        mediaGeral: Number(mediaGeral.toFixed(2)),
        distribuicao: distribuicao.map((count, index) => ({
          estrelas: index + 1,
          quantidade: count,
          percentual: totalAvaliacoes > 0 ? (count / totalAvaliacoes) * 100 : 0
        }))
      };
    }
  });
}
