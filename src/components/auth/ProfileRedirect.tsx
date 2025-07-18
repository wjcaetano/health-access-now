
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading, isPrestador, isAdmin, isUnidadeUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user || !profile) return;

    // Redirecionar baseado no perfil do usuário
    if (isPrestador) {
      navigate('/prestador/portal', { replace: true });
    } else if (isAdmin && profile.nivel_acesso === 'admin') {
      // Admin pode escolher entre franqueadora ou unidade
      // Por padrão, vai para unidade
      navigate('/unidade/dashboard', { replace: true });
    } else if (isUnidadeUser) {
      navigate('/unidade/dashboard', { replace: true });
    } else {
      // Fallback para login se não se encaixar em nenhum perfil
      navigate('/login', { replace: true });
    }
  }, [user, profile, loading, navigate, isPrestador, isAdmin, isUnidadeUser]);

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
