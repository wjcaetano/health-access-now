
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredLevel?: 'colaborador' | 'atendente' | 'gerente' | 'admin' | 'prestador';
  fallbackPath?: string;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requiredLevel,
  fallbackPath = '/dashboard' 
}) => {
  const { user, profile, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredLevel && profile) {
    const levels = ['colaborador', 'atendente', 'gerente', 'admin', 'prestador'];
    const userLevelIndex = levels.indexOf(profile.nivel_acesso);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    if (userLevelIndex < requiredLevelIndex && profile.nivel_acesso !== 'prestador') {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return <>{children}</>;
};
