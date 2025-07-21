
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const ProfileRedirect: React.FC = () => {
  const { user, profile, loading, isPrestador, isAdmin, isUnidadeUser } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (loading || !user || !profile || hasRedirected.current) return;

    hasRedirected.current = true;
    
    // Determinar redirecionamento baseado no perfil
    if (isPrestador) {
      navigate('/prestador/portal', { replace: true });
    } else if (isAdmin && profile.nivel_acesso === 'admin') {
      navigate('/franqueadora/dashboard', { replace: true });
    } else if (isUnidadeUser) {
      navigate('/unidade/dashboard', { replace: true });
    } else {
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
