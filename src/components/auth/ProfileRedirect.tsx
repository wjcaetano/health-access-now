
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log('ProfileRedirect useEffect:', { loading, user: !!user, profile, hasRedirected: hasRedirected.current });
    
    if (loading || !user || !profile || hasRedirected.current) {
      console.log('ProfileRedirect - Early return:', { loading, user: !!user, profile: !!profile, hasRedirected: hasRedirected.current });
      return;
    }

    console.log('ProfileRedirect - User:', user.id, 'Profile:', profile);
    
    hasRedirected.current = true;
    
    // Verificar se o usuário está ativo
    if (profile.status !== 'ativo') {
      console.log('User not active, redirecting to login. Status:', profile.status);
      navigate('/login', { replace: true });
      return;
    }

    // Redirecionamento baseado no nivel_acesso do perfil
    console.log('Redirecting based on nivel_acesso:', profile.nivel_acesso);
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
      case 'colaborador':
        console.log('Redirecting colaborador to unidade dashboard');
        navigate('/unidade/dashboard', { replace: true });
        break;
      default:
        console.log('Unknown access level, redirecting to login. Level:', profile.nivel_acesso);
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
