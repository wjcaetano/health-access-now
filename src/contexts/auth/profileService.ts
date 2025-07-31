
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    const typedProfile: UserProfile = {
      id: data.id,
      email: data.email,
      nome: data.nome,
      nivel_acesso: data.nivel_acesso as 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador',
      colaborador_id: data.colaborador_id,
      prestador_id: data.prestador_id,
      unidade_id: data.unidade_id,
      status: data.status as 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo',
      foto_url: data.foto_url,
    };
    
    return typedProfile;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};
