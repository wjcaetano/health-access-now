import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  nome: string | null;
  nivel_acesso: 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador';
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
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string, nivel_acesso?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  sendPasswordReset: (email: string) => Promise<{ error: any }>;
  isAdmin: boolean;
  isManager: boolean;
  isPrestador: boolean;
  isActive: boolean;
  requiresPasswordChange: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para limpar completamente o estado de autenticação
const cleanupAuthState = () => {
  localStorage.removeItem("agendaja_authenticated");
  localStorage.removeItem("agendaja_user_type");
  
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Verificar se é senha provisória
  const requiresPasswordChange = user?.user_metadata?.senha_provisoria === true;

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setProfile(null);
        return;
      }
      
      const typedProfile: UserProfile = {
        id: data.id,
        email: data.email,
        nome: data.nome,
        nivel_acesso: data.nivel_acesso as 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador',
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
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Setup auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('Auth state change:', event, session?.user?.id);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Verificar se precisa trocar senha
              const senhaProvisoria = session.user.user_metadata?.senha_provisoria;
              if (senhaProvisoria) {
                console.log('Usuário com senha provisória detectado');
              }
              
              // Defer profile fetching to prevent deadlocks
              setTimeout(() => {
                if (mounted) {
                  fetchUserProfile(session.user.id);
                }
              }, 100);
            } else {
              setProfile(null);
            }
            
            if (!initialized) {
              setLoading(false);
              setInitialized(true);
            }
          }
        );

        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            fetchUserProfile(session.user.id);
          }
          
          setLoading(false);
          setInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchUserProfile, initialized]);

  const signIn = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Logout prévio falhou, continuando...');
      }
      
      const { error } = await supabase.auth.signInWithPassword({
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

  const sendPasswordReset = async (email: string) => {
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

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: 'Usuário não autenticado' };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

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
          senha_provisoria: false,
          senha_alterada_em: new Date().toISOString()
        }
      });
      
      if (error) throw error;
      
      if (user) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            senha_provisoria: false,
            senha_alterada_em: new Date().toISOString()
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
      
      setUser(null);
      setSession(null);
      setProfile(null);
      
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      console.log('Logout concluído, redirecionando...');
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no logout:', error);
      
      setUser(null);
      setSession(null);
      setProfile(null);
      cleanupAuthState();
      
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
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    sendPasswordReset,
    isAdmin,
    isManager,
    isPrestador,
    isActive,
    requiresPasswordChange,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
