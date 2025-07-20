
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
    let redirectPath = '/login';
    
    if (isPrestador) {
      redirectPath = '/prestador/portal';
    } else if (isAdmin && profile.nivel_acesso === 'admin') {
      redirectPath = '/franqueadora/dashboard';
    } else if (isUnidadeUser) {
      redirectPath = '/unidade/dashboard';
    }
    
    // Redirecionar apenas uma vez
    navigate(redirectPath, { replace: true });
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
