
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import ProfileRedirect from "@/components/auth/ProfileRedirect";
import Login from "@/pages/auth/Login";
import RecoveryPage from "@/pages/RecoveryPage";
import CadastroCliente from "@/pages/auth/CadastroCliente";
import CadastroPrestador from "@/pages/auth/CadastroPrestador";
import AprovacoesPage from "@/pages/AprovacoesPage";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";
import { RouteRedirects } from "@/components/layout/navigation/RouteRedirects";

// Lazy load portals
import { 
  LazyHubPortal, 
  LazyPrestadorPortal
} from "@/components/layout/LazyPages";

// Cliente portal (não está no LazyPages ainda)
import { lazy } from "react";
const LazyClientePortal = lazy(() => import("@/components/portals/ClientePortal"));

// Páginas públicas (não lazy pois são críticas)
import PaginaDeVendas from "@/pages/PaginaDeVendas";
import PortalParceiro from "@/pages/parceiros/PortalParceiro";
import ConsultasMedicas from "@/pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "@/pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "@/pages/servicos/ExamesDeImagem";
import OutrosExames from "@/pages/servicos/OutrosExames";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                {/* Route Redirects - Handle legacy routes automatically */}
                <RouteRedirects />
                
                <Routes>
                  {/* Página Principal */}
                  <Route path="/" element={<PaginaDeVendas />} />
                  
                  {/* Autenticação */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/recovery" element={<RecoveryPage />} />
                  <Route path="/register/client" element={<CadastroCliente />} />
                  <Route path="/register/provider" element={<CadastroPrestador />} />
                  <Route path="/auth/redirect" element={<ProfileRedirect />} />
                  
                  {/* Páginas Públicas */}
                  <Route path="/portal-parceiro" element={<PortalParceiro />} />
                  
                  {/* Serviços Públicos */}
                  <Route path="/servicos/consultas-medicas" element={<ConsultasMedicas />} />
                  <Route path="/servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
                  <Route path="/servicos/exames-de-imagem" element={<ExamesDeImagem />} />
                  <Route path="/servicos/outros-exames" element={<OutrosExames />} />
                  
                  {/* Portal do Hub AGENDAJA - para gerentes, atendentes e admins */}
                  <Route path="/hub/*" element={
                    <ProtectedRoute>
                      <SuspenseWrapper minHeight="100vh">
                        <LazyHubPortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Aprovações - apenas admins */}
                  <Route path="/approvals" element={
                    <ProtectedRoute requiredLevel="admin">
                      <AprovacoesPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Portal do Prestador - apenas para prestadores */}
                  <Route path="/provider/*" element={
                    <ProtectedRoute requiredLevel="prestador">
                      <SuspenseWrapper minHeight="100vh">
                        <LazyPrestadorPortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Portal do Cliente - apenas para clientes */}
                  <Route path="/client/*" element={
                    <ProtectedRoute requiredLevel="cliente">
                      <SuspenseWrapper minHeight="100vh">
                        <LazyClientePortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Página 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                {/* Toasters */}
                <Toaster />
                <SonnerToaster />
              </Router>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
