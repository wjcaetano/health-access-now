
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

// Hook independente para usar autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-exportar para compatibilidade com importações existentes
export { useAuth as useAuthFromContext } from '@/contexts/AuthContext';
