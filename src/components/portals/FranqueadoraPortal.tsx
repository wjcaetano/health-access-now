
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import PortalErrorBoundary from "@/components/shared/PortalErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";

// Páginas específicas da franqueadora
import {
  LazyDashboardFranqueadora as DashboardFranqueadora,
  LazyGestaoFranquias as GestaoFranquias,
  LazyLeadsFranqueados as LeadsFranqueados,
  LazyCRMFranqueados as CRMFranqueados,
  LazyFinanceiroMatriz as FinanceiroMatriz,
  LazyGestaoRoyalties as GestaoRoyalties,
  LazyGestaoContratos as GestaoContratos,
  LazyRelatoriosExecutivos as RelatoriosExecutivos,
  LazyMetasKPIs as MetasKPIs,
  LazyExpansaoFranquias as ExpansaoFranquias,
  LazyMeuPerfil as MeuPerfil
} from "@/components/layout/LazyPages";

const FranqueadoraPortal: React.FC = () => {
  const { profile, isActive } = useAuth();

  // Apenas admins da franqueadora têm acesso
  if (!isActive || profile?.nivel_acesso !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <PortalErrorBoundary portalType="franqueadora">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={
            <SuspenseWrapper>
              <DashboardFranqueadora />
            </SuspenseWrapper>
          } />
          <Route path="franquias" element={
            <SuspenseWrapper>
              <GestaoFranquias />
            </SuspenseWrapper>
          } />
          <Route path="leads" element={
            <SuspenseWrapper>
              <LeadsFranqueados />
            </SuspenseWrapper>
          } />
          <Route path="franqueados" element={
            <SuspenseWrapper>
              <CRMFranqueados />
            </SuspenseWrapper>
          } />
          <Route path="financeiro" element={
            <SuspenseWrapper>
              <FinanceiroMatriz />
            </SuspenseWrapper>
          } />
          <Route path="royalties" element={
            <SuspenseWrapper>
              <GestaoRoyalties />
            </SuspenseWrapper>
          } />
          <Route path="contratos" element={
            <SuspenseWrapper>
              <GestaoContratos />
            </SuspenseWrapper>
          } />
          <Route path="relatorios" element={
            <SuspenseWrapper>
              <RelatoriosExecutivos />
            </SuspenseWrapper>
          } />
          <Route path="metas" element={
            <SuspenseWrapper>
              <MetasKPIs />
            </SuspenseWrapper>
          } />
          <Route path="expansao" element={
            <SuspenseWrapper>
              <ExpansaoFranquias />
            </SuspenseWrapper>
          } />
          <Route path="perfil" element={
            <SuspenseWrapper>
              <MeuPerfil />
            </SuspenseWrapper>
          } />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Layout>
    </PortalErrorBoundary>
  );
};

export default FranqueadoraPortal;
