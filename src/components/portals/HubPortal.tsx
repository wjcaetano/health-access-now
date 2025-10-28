
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";

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
  const { profile, isActive } = useAuth();

  // Verificar se é um usuário do hub (admin, gerente, atendente ou colaborador)
  if (!isActive || !['admin', 'atendente', 'gerente', 'colaborador'].includes(profile?.nivel_acesso || '')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="hub">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <SuspenseWrapper>
              <Index />
            </SuspenseWrapper>
          } />
          <Route path="dashboard-estrategico" element={
            <SuspenseWrapper>
              <DashboardEstrategicoPage />
            </SuspenseWrapper>
          } />
          <Route path="buscar-prestadores" element={
            <SuspenseWrapper>
              <BuscarPrestadores />
            </SuspenseWrapper>
          } />
          <Route path="marketplace" element={
            <SuspenseWrapper>
              <MarketplaceServicos />
            </SuspenseWrapper>
          } />
          <Route path="relatorios" element={
            <SuspenseWrapper>
              <RelatoriosCentralizadosPage />
            </SuspenseWrapper>
          } />
          <Route path="vendas" element={
            <SuspenseWrapper>
              <Vendas />
            </SuspenseWrapper>
          } />
          <Route path="clientes/*" element={
            <SuspenseWrapper>
              <Clientes />
            </SuspenseWrapper>
          } />
          <Route path="agendamentos/*" element={
            <SuspenseWrapper>
              <Agendamentos />
            </SuspenseWrapper>
          } />
          <Route path="orcamentos/*" element={
            <SuspenseWrapper>
              <Orcamentos />
            </SuspenseWrapper>
          } />
          <Route path="servicos/*" element={
            <SuspenseWrapper>
              <Servicos />
            </SuspenseWrapper>
          } />
          <Route path="prestadores/*" element={
            <SuspenseWrapper>
              <Prestadores />
            </SuspenseWrapper>
          } />
          <Route path="financeiro" element={
            <SuspenseWrapper>
              <Financeiro />
            </SuspenseWrapper>
          } />
          {['gerente', 'admin'].includes(profile?.nivel_acesso || '') && (
            <Route path="colaboradores" element={
              <SuspenseWrapper>
                <Colaboradores />
              </SuspenseWrapper>
            } />
          )}
          <Route path="perfil" element={
            <SuspenseWrapper>
              <MeuPerfil />
            </SuspenseWrapper>
          } />
          {['gerente', 'admin'].includes(profile?.nivel_acesso || '') && (
            <Route path="configuracoes" element={
              <SuspenseWrapper>
                <SystemSettings />
              </SuspenseWrapper>
            } />
          )}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default HubPortal;
