
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { InviteAcceptance } from '@/components/auth/InviteAcceptance';
import { TenantAwareLayout } from '@/components/layout/TenantAwareLayout';

// Lazy-load pages to improve initial load time
const IndexPage = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/auth/Login'));
const AdvancedDashboardPage = lazy(() => import('@/pages/AdvancedDashboard'));
const VendasPage = lazy(() => import('@/pages/Vendas'));
const ClientesPage = lazy(() => import('@/pages/Clientes'));
const PrestadoresPage = lazy(() => import('@/pages/Prestadores'));
const ServicosPage = lazy(() => import('@/pages/Servicos'));
const AgendamentosPage = lazy(() => import('@/pages/Agendamentos'));
const OrcamentosPage = lazy(() => import('@/pages/Orcamentos'));
const ColaboradoresPage = lazy(() => import('@/pages/Colaboradores'));
const GestaoUsuariosPage = lazy(() => import('@/pages/GestaoUsuarios'));
const MeuPerfilPage = lazy(() => import('@/pages/MeuPerfil'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const RecoveryPage = lazy(() => import('@/pages/RecoveryPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const TenantsManagement = lazy(() => import('@/pages/admin/TenantsManagement'));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
  }>
    {children}
  </Suspense>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const AppRoutes: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<SuspenseWrapper><IndexPage /></SuspenseWrapper>} />
                <Route path="/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />
                <Route path="/recovery" element={<SuspenseWrapper><RecoveryPage /></SuspenseWrapper>} />
                <Route path="/accept-invite" element={<SuspenseWrapper><InviteAcceptance /></SuspenseWrapper>} />
                
                {/* Protected routes with tenant context */}
                <Route path="/dashboard" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><AdvancedDashboardPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/vendas" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><VendasPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/clientes" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><ClientesPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/prestadores" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><PrestadoresPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/servicos" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><ServicosPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/agendamentos" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><AgendamentosPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/orcamentos" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><OrcamentosPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/colaboradores" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><ColaboradoresPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/gestao-usuarios" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><GestaoUsuariosPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="/meu-perfil" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><MeuPerfilPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                <Route path="/admin/tenants" element={
                  <TenantAwareLayout>
                    <SuspenseWrapper><TenantsManagement /></SuspenseWrapper>
                  </TenantAwareLayout>
                } />
                
                <Route path="*" element={<SuspenseWrapper><NotFoundPage /></SuspenseWrapper>} />
              </Routes>
              <Toaster />
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppRoutes;
