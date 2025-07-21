
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredLevel?: 'atendente' | 'gerente' | 'admin' | 'prestador';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requiredLevel,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, profile, loading, initialized } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - User:', user?.id, 'Profile:', profile, 'Loading:', loading, 'Initialized:', initialized);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile) {
    console.log('No profile, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (profile.status !== 'ativo') {
    console.log('User not active, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && profile.nivel_acesso !== 'admin') {
    console.log('Admin required but user is not admin, redirecting');
    return <Navigate to="/unidade/dashboard" replace />;
  }

  // Check specific level requirement
  if (requiredLevel && profile.nivel_acesso !== requiredLevel) {
    console.log('Required level not met, redirecting based on user level');
    switch (profile.nivel_acesso) {
      case 'prestador':
        return <Navigate to="/prestador/portal" replace />;
      case 'admin':
        return <Navigate to="/franqueadora/dashboard" replace />;
      default:
        return <Navigate to="/unidade/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
