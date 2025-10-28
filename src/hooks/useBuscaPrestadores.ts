import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FiltrosBusca {
  especialidade?: string;
  tipoOrganizacao?: 'clinica' | 'laboratorio' | 'prestador_pessoa_juridica';
  localizacao?: string;
  disponibilidade?: 'disponivel' | 'indisponivel' | 'ocupado';
  avaliacaoMinima?: number;
  busca?: string;
}

export function useBuscaPrestadores(filtros: FiltrosBusca = {}) {
  return useQuery({
    queryKey: ['busca-prestadores', filtros],
    queryFn: async () => {
      let query = supabase
        .from('prestadores')
        .select(`
          *,
          organizacao:organizacoes(
            id,
            nome,
            tipo_organizacao
          )
        `)
        .eq('ativo', true);

      // Filtro por especialidade
      if (filtros.especialidade) {
        query = query.contains('especialidades', [filtros.especialidade]);
      }

      // Filtro por localização
      if (filtros.localizacao) {
        query = query.ilike('localizacao', `%${filtros.localizacao}%`);
      }

      // Filtro por disponibilidade
      if (filtros.disponibilidade) {
        query = query.eq('disponibilidade', filtros.disponibilidade);
      }

      // Filtro por avaliação mínima
      if (filtros.avaliacaoMinima) {
        query = query.gte('media_avaliacoes', filtros.avaliacaoMinima);
      }

      // Busca textual (nome, especialidade, etc)
      if (filtros.busca) {
        query = query.or(`nome.ilike.%${filtros.busca}%,email.ilike.%${filtros.busca}%`);
      }

      const { data, error } = await query.order('media_avaliacoes', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}

export function useEspecialidadesDisponiveis() {
  return useQuery({
    queryKey: ['especialidades-disponiveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestadores')
        .select('especialidades')
        .eq('ativo', true);

      if (error) throw error;

      // Extrair todas as especialidades únicas
      const especialidadesSet = new Set<string>();
      data.forEach(prestador => {
        if (prestador.especialidades) {
          prestador.especialidades.forEach((esp: string) => especialidadesSet.add(esp));
        }
      });

      return Array.from(especialidadesSet).sort();
    }
  });
}

export function useLocalizacoesDisponiveis() {
  return useQuery({
    queryKey: ['localizacoes-disponiveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prestadores')
        .select('localizacao')
        .eq('ativo', true)
        .not('localizacao', 'is', null);

      if (error) throw error;

      const localizacoesSet = new Set(data.map(p => p.localizacao).filter(Boolean));
      return Array.from(localizacoesSet).sort();
    }
  });
}
