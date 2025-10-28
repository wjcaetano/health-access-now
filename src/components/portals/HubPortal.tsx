
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { useHasRole, useIsAdminOrManager } from "@/hooks/useUserRoles";
import { HUB_ROUTES } from "@/lib/routes";

// Lazy load páginas específicas do Hub AGENDAJA
import { 
  LazyIndex as Index,
  LazyVendas as Vendas,
  LazyClientes as Clientes,
  LazyAgendamentos as Agendamentos,
  LazyOrcamentos as Orcamentos,
  LazyServicos as Servicos,
  LazyPrestadores as Prestadores,
  LazyFinanceiro as Financeiro,
  LazyColaboradores as Colaboradores,
  LazyMeuPerfil as MeuPerfil,
  LazySystemSettings as SystemSettings
} from "@/components/layout/LazyPages";

// Fase 4 - Novas páginas
import { lazy } from "react";
const BuscarPrestadores = lazy(() => import("@/pages/BuscarPrestadores"));
const MarketplaceServicos = lazy(() => import("@/pages/MarketplaceServicos"));
const DashboardEstrategicoPage = lazy(() => import("@/pages/DashboardEstrategicoPage"));
const RelatoriosCentralizadosPage = lazy(() => import("@/pages/RelatoriosCentralizadosPage"));

const HubPortal: React.FC = () => {
  const { user, isActive } = useAuth();
  const isAdmin = useHasRole(user?.id, 'admin');
  const isManager = useHasRole(user?.id, 'gerente');
  const isAtendente = useHasRole(user?.id, 'atendente');
  const isColaborador = useHasRole(user?.id, 'colaborador');

  // Verificar se é um usuário do hub
  const isHubUser = isAdmin || isManager || isAtendente || isColaborador;

  if (!isActive || !isHubUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="hub">
      <Layout>
        <Routes>
          {/* Default redirect */}
          <Route index element={<Navigate to="overview" replace />} />
          
          {/* Dashboard e Analytics */}
          <Route path="overview" element={
            <SuspenseWrapper>
              <Index />
            </SuspenseWrapper>
          } />
          <Route path="analytics" element={
            <SuspenseWrapper>
              <DashboardEstrategicoPage />
            </SuspenseWrapper>
          } />
          
          {/* Operacional */}
          <Route path="sales/*" element={
            <SuspenseWrapper>
              <Vendas />
            </SuspenseWrapper>
          } />
          <Route path="appointments/*" element={
            <SuspenseWrapper>
              <Agendamentos />
            </SuspenseWrapper>
          } />
          <Route path="quotes/*" element={
            <SuspenseWrapper>
              <Orcamentos />
            </SuspenseWrapper>
          } />
          
          {/* Gestão */}
          <Route path="customers/*" element={
            <SuspenseWrapper>
              <Clientes />
            </SuspenseWrapper>
          } />
          <Route path="providers/*" element={
            <SuspenseWrapper>
              <Prestadores />
            </SuspenseWrapper>
          } />
          <Route path="providers/search" element={
            <SuspenseWrapper>
              <BuscarPrestadores />
            </SuspenseWrapper>
          } />
          <Route path="services/*" element={
            <SuspenseWrapper>
              <Servicos />
            </SuspenseWrapper>
          } />
          <Route path="services/marketplace" element={
            <SuspenseWrapper>
              <MarketplaceServicos />
            </SuspenseWrapper>
          } />
          <Route path="finance" element={
            <SuspenseWrapper>
              <Financeiro />
            </SuspenseWrapper>
          } />
          
          {/* Administração */}
          {(isAdmin || isManager) && (
            <Route path="team" element={
              <SuspenseWrapper>
                <Colaboradores />
              </SuspenseWrapper>
            } />
          )}
          <Route path="reports" element={
            <SuspenseWrapper>
              <RelatoriosCentralizadosPage />
            </SuspenseWrapper>
          } />
          {(isAdmin || isManager) && (
            <Route path="settings" element={
              <SuspenseWrapper>
                <SystemSettings />
              </SuspenseWrapper>
            } />
          )}
          <Route path="profile" element={
            <SuspenseWrapper>
              <MeuPerfil />
            </SuspenseWrapper>
          } />
          
          {/* Legacy redirects - backward compatibility */}
          <Route path="dashboard" element={<Navigate to={HUB_ROUTES.ROOT} replace />} />
          <Route path="dashboard-estrategico" element={<Navigate to={HUB_ROUTES.ANALYTICS} replace />} />
          <Route path="vendas" element={<Navigate to={HUB_ROUTES.SALES} replace />} />
          <Route path="agendamentos" element={<Navigate to={HUB_ROUTES.APPOINTMENTS} replace />} />
          <Route path="orcamentos" element={<Navigate to={HUB_ROUTES.QUOTES} replace />} />
          <Route path="clientes" element={<Navigate to={HUB_ROUTES.CUSTOMERS} replace />} />
          <Route path="prestadores" element={<Navigate to={HUB_ROUTES.PROVIDERS} replace />} />
          <Route path="buscar-prestadores" element={<Navigate to={HUB_ROUTES.PROVIDERS_SEARCH} replace />} />
          <Route path="marketplace" element={<Navigate to={HUB_ROUTES.SERVICES_MARKETPLACE} replace />} />
          <Route path="servicos" element={<Navigate to={HUB_ROUTES.SERVICES} replace />} />
          <Route path="financeiro" element={<Navigate to={HUB_ROUTES.FINANCE} replace />} />
          <Route path="colaboradores" element={<Navigate to={HUB_ROUTES.TEAM} replace />} />
          <Route path="relatorios" element={<Navigate to={HUB_ROUTES.REPORTS} replace />} />
          <Route path="configuracoes" element={<Navigate to={HUB_ROUTES.SETTINGS} replace />} />
          <Route path="perfil" element={<Navigate to={HUB_ROUTES.PROFILE} replace />} />
          <Route path="meu-perfil" element={<Navigate to={HUB_ROUTES.PROFILE} replace />} />
          
          {/* Catch all - redirect to root */}
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default HubPortal;
