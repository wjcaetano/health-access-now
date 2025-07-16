
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  LazyIndex,
  LazyClientes,
  LazyNovoCliente,
  LazyPrestadores,
  LazyNovoPrestador,
  LazyServicos,
  LazyNovoServico,
  LazyOrcamentos,
  LazyVisualizarOrcamento,
  LazyVendas,
  LazyVendaFinalizada,
  LazyAgendamentos,
  LazyNovoAgendamento,
  LazyColaboradores,
  LazyFinanceiro,
  LazyAgendaPagamentos,
  LazyGuias,
  LazyConversas,
  LazyGestaoUsuarios,
  LazyMeuPerfil,
  LazyAnaliseDoSistema,
  LazyAdvancedDashboardPage,
  LazyReportsPage,
  LazyBackupPage,
  LazySystemSettings,
  LazyDashboardFranqueadora,
  LazyGestaoFranquias,
  LazyLeadsFranqueados,
  LazyCRMFranqueados,
  LazyFinanceiroMatriz,
  LazyGestaoRoyalties,
  LazyGestaoContratos,
  LazyRelatoriosExecutivos,
  LazyMetasKPIs,
  LazyExpansaoFranquias
} from "./LazyPages";
import { RouteGuard } from "./guards/RouteGuard";
import { AdminGuard } from "./guards/AdminGuard";
import { ManagerGuard } from "./guards/ManagerGuard";

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={
        <SuspenseWrapper>
          <LazyIndex />
        </SuspenseWrapper>
      } />
      
      <Route path="/clientes" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyClientes />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/clientes/novo" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyNovoCliente />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/prestadores" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyPrestadores />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/prestadores/novo" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyNovoPrestador />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/servicos" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyServicos />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/servicos/novo" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyNovoServico />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/orcamentos" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyOrcamentos />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/orcamentos/:id" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyVisualizarOrcamento />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/vendas" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyVendas />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/vendas/finalizada" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyVendaFinalizada />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/agendamentos" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyAgendamentos />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/agendamentos/novo" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyNovoAgendamento />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/colaboradores" element={
        <SuspenseWrapper>
          <ManagerGuard>
            <LazyColaboradores />
          </ManagerGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/financeiro" element={
        <SuspenseWrapper>
          <ManagerGuard>
            <LazyFinanceiro />
          </ManagerGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/agenda-pagamentos" element={
        <SuspenseWrapper>
          <ManagerGuard>
            <LazyAgendaPagamentos />
          </ManagerGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/guias" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyGuias />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/conversas" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyConversas />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/gestao-usuarios" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyGestaoUsuarios />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/meu-perfil" element={
        <SuspenseWrapper>
          <RouteGuard>
            <LazyMeuPerfil />
          </RouteGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/analise-sistema" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyAnaliseDoSistema />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/dashboard-avancado" element={
        <SuspenseWrapper>
          <ManagerGuard>
            <LazyAdvancedDashboardPage />
          </ManagerGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/relatorios" element={
        <SuspenseWrapper>
          <ManagerGuard>
            <LazyReportsPage />
          </ManagerGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/backup" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyBackupPage />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/configuracoes-sistema" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazySystemSettings />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      {/* Franqueadora Routes - Admin only */}
      <Route path="/franqueadora/dashboard" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyDashboardFranqueadora />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/franquias" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyGestaoFranquias />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/leads" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyLeadsFranqueados />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/franqueados" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyCRMFranqueados />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/financeiro" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyFinanceiroMatriz />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/royalties" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyGestaoRoyalties />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/contratos" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyGestaoContratos />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/relatorios" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyRelatoriosExecutivos />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/metas" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyMetasKPIs />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="/franqueadora/expansao" element={
        <SuspenseWrapper>
          <AdminGuard>
            <LazyExpansaoFranquias />
          </AdminGuard>
        </SuspenseWrapper>
      } />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
