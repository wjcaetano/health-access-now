
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!userId) return null;
  
  try {
    console.log('Fazendo query para buscar perfil do usuário:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email, 
        nome,
        nivel_acesso,
        colaborador_id,
        prestador_id,
        cliente_id,
        organizacao_id,
        status,
        foto_url
      `)
      .eq('id', userId)
      .single();
    
    console.log('Resultado da query profiles:', { data, error });
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    const typedProfile: UserProfile = {
      id: data.id,
      email: data.email,
      nome: data.nome,
      nivel_acesso: data.nivel_acesso as 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador' | 'cliente',
      colaborador_id: data.colaborador_id,
      prestador_id: data.prestador_id,
      cliente_id: data.cliente_id,
      organizacao_id: data.organizacao_id,
      status: data.status as 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo',
      foto_url: data.foto_url,
    };
    
    return typedProfile;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};
