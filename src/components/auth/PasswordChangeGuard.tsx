
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PasswordChangeGuardProps {
  children: React.ReactNode;
}

export function PasswordChangeGuard({ children }: PasswordChangeGuardProps) {
  const { user, requiresPasswordChange, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && requiresPasswordChange) {
      // Se o usuário precisa trocar a senha e não está na página de troca
      if (location.pathname !== '/troca-senha-obrigatoria') {
        navigate('/troca-senha-obrigatoria', { replace: true });
      }
    }
  }, [user, requiresPasswordChange, loading, navigate, location.pathname]);

  // Se está carregando ou precisa trocar senha e não está na página certa, não renderiza
  if (loading || (requiresPasswordChange && location.pathname !== '/troca-senha-obrigatoria')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-agendaja-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
