
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requiredLevel?: 'atendente' | 'gerente' | 'admin' | 'prestador' | 'cliente';
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

  console.log('ProtectedRoute - User:', user?.id, 'Profile nivel_acesso:', profile?.nivel_acesso, 'Profile status:', profile?.status, 'Loading:', loading, 'Initialized:', initialized);

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

  // Permitir prestadores aguardando aprovação acessarem página especial
  if (profile.status === 'aguardando_aprovacao' && profile.nivel_acesso === 'prestador') {
    console.log('Prestador aguardando aprovação, redirecting to waiting page');
    return <Navigate to="/aguardando-aprovacao" replace />;
  }

  if (profile.status !== 'ativo') {
    console.log('User not active, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement (no admin level anymore)
  if (requireAdmin) {
    console.log('Admin required but admin level removed, redirecting');
    return <Navigate to="/hub" replace />;
  }

  // Check specific level requirement with hierarchical access
  if (requiredLevel && profile.nivel_acesso) {
    const levels = ['colaborador', 'atendente', 'gerente', 'admin'];
    const userLevelIndex = levels.indexOf(profile.nivel_acesso);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    // Handle special roles that don't fit hierarchical structure
    if (profile.nivel_acesso === 'prestador' && requiredLevel !== 'prestador') {
      console.log('Prestador trying to access non-prestador route, redirecting');
      return <Navigate to="/provider" replace />;
    }
    
    if (profile.nivel_acesso === 'cliente' && requiredLevel !== 'cliente') {
      console.log('Cliente trying to access non-cliente route, redirecting');
      return <Navigate to="/client" replace />;
    }
    
    if (requiredLevel === 'prestador' && profile.nivel_acesso !== 'prestador') {
      console.log('Non-prestador trying to access prestador route, redirecting');
      return <Navigate to="/hub" replace />;
    }
    
    if (requiredLevel === 'cliente' && profile.nivel_acesso !== 'cliente') {
      console.log('Non-cliente trying to access cliente route, redirecting');
      return <Navigate to="/hub" replace />;
    }
    
    if (requiredLevel !== 'prestador' && requiredLevel !== 'cliente' && userLevelIndex < requiredLevelIndex) {
      console.log('Required level not met, redirecting based on user level');
      return <Navigate to="/hub" replace />;
    }
  }

  return <>{children}</>;
}
