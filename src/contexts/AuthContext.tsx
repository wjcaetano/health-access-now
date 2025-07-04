
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  nome: string | null;
  nivel_acesso: 'colaborador' | 'atendente' | 'gerente' | 'admin';
  colaborador_id: string | null;
  prestador_id: string | null;
  status: 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo';
  foto_url: string | null;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, nivel_acesso?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  isAdmin: boolean;
  isManager: boolean;
  isPrestador: boolean;
  isActive: boolean;
  requiresPasswordChange: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  // Limpar localStorage
  localStorage.removeItem("agendaja_authenticated");
  localStorage.removeItem("agendaja_user_type");
  
  // Limpar todas as chaves do Supabase auth
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Limpar sessionStorage se estiver em uso
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se o usuário precisa trocar a senha
  const requiresPasswordChange = user?.user_metadata?.senha_provisoria === true;

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Garantir que nivel_acesso e status estão tipados corretamente
      const typedProfile: UserProfile = {
        id: data.id,
        email: data.email,
        nome: data.nome,
        nivel_acesso: data.nivel_acesso as 'colaborador' | 'atendente' | 'gerente' | 'admin',
        colaborador_id: data.colaborador_id,
        prestador_id: data.prestador_id,
        status: data.status as 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo',
        foto_url: data.foto_url,
      };
      
      setProfile(typedProfile);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to prevent deadlocks
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Limpar estado antes de fazer login
      cleanupAuthState();
      
      // Tentar fazer logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar mesmo se falhar
        console.log('Logout prévio falhou, continuando...');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nome: string, nivel_acesso = 'colaborador') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: 'Usuário não autenticado' };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchUserProfile(user.id);
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          senha_provisoria: false // Remove a flag de senha provisória
        }
      });
      
      if (error) throw error;
      
      // Atualizar o user state localmente
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            senha_provisoria: false
          }
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Limpar estado local imediatamente
      setUser(null);
      setSession(null);
      setProfile(null);
      
      // Limpar localStorage e sessionStorage
      cleanupAuthState();
      
      // Fazer logout no Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      console.log('Logout concluído, redirecionando...');
      
      // Forçar refresh da página para garantir estado limpo
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no logout:', error);
      
      // Mesmo se houver erro, limpar estado e redirecionar
      setUser(null);
      setSession(null);
      setProfile(null);
      cleanupAuthState();
      
      // Forçar refresh mesmo se logout falhar
      window.location.href = '/';
    }
  };

  const isAdmin = profile?.nivel_acesso === 'admin';
  const isManager = profile?.nivel_acesso === 'gerente' || isAdmin;
  const isPrestador = !!profile?.prestador_id;
  const isActive = profile?.status === 'ativo';

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    isAdmin,
    isManager,
    isPrestador,
    isActive,
    requiresPasswordChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
