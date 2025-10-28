import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FiltrosMarketplace {
  categoria?: string;
  prestadorId?: string;
  organizacaoId?: string;
  precoMin?: number;
  precoMax?: number;
  busca?: string;
}

export function useMarketplaceServicos(filtros: FiltrosMarketplace = {}) {
  return useQuery({
    queryKey: ['marketplace-servicos', filtros],
    queryFn: async () => {
      let query = supabase
        .from('servicos')
        .select(`
          *,
          prestador:prestadores(
            id,
            nome,
            tipo,
            especialidades,
            media_avaliacoes,
            total_avaliacoes,
            localizacao,
            disponibilidade
          ),
          organizacao:organizacoes(
            id,
            nome,
            tipo_organizacao
          )
        `)
        .eq('ativo', true);

      // Filtro por categoria
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria);
      }

      // Filtro por prestador
      if (filtros.prestadorId) {
        query = query.eq('prestador_id', filtros.prestadorId);
      }

      // Filtro por organização
      if (filtros.organizacaoId) {
        query = query.eq('organizacao_id', filtros.organizacaoId);
      }

      // Filtro por faixa de preço
      if (filtros.precoMin !== undefined) {
        query = query.gte('valor_venda', filtros.precoMin);
      }
      if (filtros.precoMax !== undefined) {
        query = query.lte('valor_venda', filtros.precoMax);
      }

      // Busca textual
      if (filtros.busca) {
        query = query.or(`nome.ilike.%${filtros.busca}%,descricao.ilike.%${filtros.busca}%,categoria.ilike.%${filtros.busca}%`);
      }

      const { data, error } = await query.order('valor_venda', { ascending: true });

      if (error) throw error;
      return data;
    }
  });
}

export function useCategoriasServicos() {
  return useQuery({
    queryKey: ['categorias-servicos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select('categoria')
        .eq('ativo', true);

      if (error) throw error;

      const categoriasSet = new Set(data.map(s => s.categoria).filter(Boolean));
      return Array.from(categoriasSet).sort();
    }
  });
}

export function useServicoDetalhado(servicoId: string) {
  return useQuery({
    queryKey: ['servico-detalhado', servicoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('servicos')
        .select(`
          *,
          prestador:prestadores(
            *,
            organizacao:organizacoes(*)
          ),
          organizacao:organizacoes(*),
          servico_prestadores(
            prestador:prestadores(
              id,
              nome,
              tipo,
              media_avaliacoes,
              total_avaliacoes,
              localizacao,
              disponibilidade
            )
          )
        `)
        .eq('id', servicoId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!servicoId
  });
}
