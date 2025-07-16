
import { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email: string;
  nome: string | null;
  nivel_acesso: 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador';
  colaborador_id: string | null;
  prestador_id: string | null;
  tenant_id: string | null;
  status: 'pendente' | 'aguardando_aprovacao' | 'ativo' | 'suspenso' | 'inativo';
  foto_url: string | null;
};

export type AuthContextType = {
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
  hasMultiTenantAccess: boolean;
};
