
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);
  const redirectTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Aguardar inicialização completa
    if (!initialized || loading) {
      console.log('ProfileRedirect - Waiting for initialization:', { initialized, loading });
      return;
    }

    // Se já redirecionou, não fazer nada
    if (hasRedirected.current) {
      console.log('ProfileRedirect - Already redirected, skipping');
      return;
    }

    // Se não tem usuário, redirecionar para login
    if (!user) {
      console.log('ProfileRedirect - No user, redirecting to login');
      hasRedirected.current = true;
      navigate('/login', { replace: true });
      return;
    }

    // Se não tem perfil ainda, aguardar
    if (!profile) {
      console.log('ProfileRedirect - No profile yet, waiting...');
      return;
    }

    console.log('ProfileRedirect - Processing redirect for user:', user.id, 'Profile:', profile);
    
    // Verificar se o usuário está ativo
    if (profile.status !== 'ativo') {
      console.log('User not active, redirecting to login. Status:', profile.status);
      hasRedirected.current = true;
      navigate('/login', { replace: true });
      return;
    }

    // Marcar como redirecionado ANTES de fazer o redirecionamento e usar timeout para evitar loops
    hasRedirected.current = true;

    // Usar setTimeout para evitar problemas de re-render durante navegação
    redirectTimeout.current = setTimeout(() => {
      // Redirecionamento baseado no nivel_acesso do perfil
      console.log('Redirecting based on nivel_acesso:', profile.nivel_acesso);
      switch (profile.nivel_acesso) {
        case 'prestador':
          console.log('Redirecting to prestador portal');
          navigate('/prestador/portal', { replace: true });
          break;
        case 'gerente':
        case 'atendente':
        case 'colaborador':
          console.log('Redirecting to unidade dashboard');
          navigate('/unidade/dashboard', { replace: true });
          break;
        default:
          console.log('Unknown access level, redirecting to login. Level:', profile.nivel_acesso);
          navigate('/login', { replace: true });
          break;
      }
    }, 100);
  }, [initialized, loading, user, profile, navigate]);

  // Reset hasRedirected se o usuário mudou e limpar timeout
  useEffect(() => {
    if (user?.id) {
      hasRedirected.current = false;
    }
    
    return () => {
      if (redirectTimeout.current) {
        clearTimeout(redirectTimeout.current);
      }
    };
  }, [user?.id]);

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return null;
};

export default ProfileRedirect;
