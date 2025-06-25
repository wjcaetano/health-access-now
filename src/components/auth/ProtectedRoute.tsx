
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredLevel?: 'colaborador' | 'atendente' | 'gerente' | 'admin';
}

export function ProtectedRoute({ children, requiredLevel }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
        return;
      }

      if (requiredLevel && profile) {
        const levels = ['colaborador', 'atendente', 'gerente', 'admin'];
        const userLevelIndex = levels.indexOf(profile.nivel_acesso);
        const requiredLevelIndex = levels.indexOf(requiredLevel);
        
        if (userLevelIndex < requiredLevelIndex) {
          navigate('/');
          return;
        }
      }
    }
  }, [user, profile, loading, navigate, requiredLevel]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agendaja-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
