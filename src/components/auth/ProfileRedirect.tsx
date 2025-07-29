
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (loading || !user || !profile || hasRedirected.current) return;

    console.log('ProfileRedirect - User:', user.id, 'Profile:', profile);
    
    hasRedirected.current = true;
    
    // Verificar se o usuário está ativo
    if (profile.status !== 'ativo') {
      console.log('User not active, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Redirecionamento baseado no nivel_acesso do perfil
    switch (profile.nivel_acesso) {
      case 'prestador':
        console.log('Redirecting to prestador portal');
        navigate('/prestador/portal', { replace: true });
        break;
      case 'gerente':
      case 'atendente':
        console.log('Redirecting to unidade dashboard');
        navigate('/unidade/dashboard', { replace: true });
        break;
      default:
        console.log('Unknown access level, redirecting to login');
        navigate('/login', { replace: true });
        break;
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return null;
};

export default ProfileRedirect;
