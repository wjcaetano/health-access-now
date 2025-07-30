
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';
import { cleanupAuthState } from './authUtils';

export const signIn = async (email: string, password: string) => {
  try {
    cleanupAuthState();
    
    // Remover tentativa de logout prévio que pode causar conflitos
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  } catch (error) {
    console.error('Erro no signIn:', error);
    return { error };
  }
};

export const signUp = async (email: string, password: string, nome: string, nivel_acesso = 'colaborador') => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nome,
          nivel_acesso
        }
      }
    });
    
    return { error };
  } catch (error) {
    return { error };
  }
};

export const sendPasswordReset = async (email: string) => {
  try {
    const redirectUrl = `${window.location.origin}/recovery`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    return { error };
  } catch (error) {
    return { error };
  }
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  try {
    if (!userId) return { error: 'Usuário não autenticado' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        senha_provisoria: false,
        senha_alterada_em: new Date().toISOString()
      }
    });
    
    if (error) throw error;
    
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const signOut = async () => {
  try {
    console.log('Iniciando logout...');
    
    cleanupAuthState();
    
    await supabase.auth.signOut({ scope: 'global' });
    
    console.log('Logout concluído, redirecionando...');
    window.location.href = '/';
    
    return { error: null };
  } catch (error) {
    console.error('Erro no logout:', error);
    
    cleanupAuthState();
    
    window.location.href = '/';
    
    return { error };
  }
};
