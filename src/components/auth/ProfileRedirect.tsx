
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading, isPrestador, isAdmin, isUnidadeUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user || !profile) return;

    // Determinar redirecionamento baseado no perfil
    const getRedirectPath = () => {
      if (isPrestador) return '/prestador/portal';
      if (isAdmin && profile.nivel_acesso === 'admin') return '/unidade/dashboard';
      if (isUnidadeUser) return '/unidade/dashboard';
      return '/login';
    };

    navigate(getRedirectPath(), { replace: true });
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
