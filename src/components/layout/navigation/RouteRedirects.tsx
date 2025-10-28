import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMigratedRoute, isLegacyRoute } from '@/lib/routeMigration';

/**
 * Componente para redirecionar automaticamente rotas legadas
 * para as novas rotas padronizadas
 */
export const RouteRedirects = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;

    // Verifica se é uma rota legada
    if (isLegacyRoute(currentPath)) {
      const newRoute = getMigratedRoute(currentPath);
      
      // Preserva query params e hash
      const search = location.search;
      const hash = location.hash;
      
      console.log(`[Route Migration] Redirecting from ${currentPath} to ${newRoute}`);
      
      // Redireciona para a nova rota
      navigate(newRoute + search + hash, { replace: true });
    }
  }, [location, navigate]);

  return null;
};
