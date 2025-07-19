
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Login from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import SuspenseWrapper from "@/components/shared/SuspenseWrapper";

// Lazy load portals
import { 
  LazyUnidadePortal, 
  LazyPrestadorPortal, 
  LazyFranqueadoraPortal 
} from "@/components/layout/LazyPages";

// Páginas públicas (não lazy pois são críticas)
import PaginaDeVendas from "@/pages/PaginaDeVendas";
import PortalParceiro from "@/pages/parceiros/PortalParceiro";
import SejaFranqueado from "@/pages/franquia/SejaFranqueado";
import ConsultasMedicas from "@/pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "@/pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "@/pages/servicos/ExamesDeImagem";
import OutrosExames from "@/pages/servicos/OutrosExames";

// Configuração otimizada do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Router>
                <Routes>
                  {/* Página Principal */}
                  <Route path="/" element={<PaginaDeVendas />} />
                  
                  {/* Autenticação */}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Páginas Públicas */}
                  <Route path="/portal-parceiro" element={<PortalParceiro />} />
                  <Route path="/seja-franqueado" element={<SejaFranqueado />} />
                  
                  {/* Serviços Públicos */}
                  <Route path="/servicos/consultas-medicas" element={<ConsultasMedicas />} />
                  <Route path="/servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
                  <Route path="/servicos/exames-de-imagem" element={<ExamesDeImagem />} />
                  <Route path="/servicos/outros-exames" element={<OutrosExames />} />
                  
                  {/* Portais Protegidos com Lazy Loading */}
                  <Route path="/unidade/*" element={
                    <ProtectedRoute>
                      <SuspenseWrapper minHeight="100vh">
                        <LazyUnidadePortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/prestador/*" element={
                    <ProtectedRoute requiredLevel="prestador">
                      <SuspenseWrapper minHeight="100vh">
                        <LazyPrestadorPortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/franqueadora/*" element={
                    <ProtectedRoute requireAdmin>
                      <SuspenseWrapper minHeight="100vh">
                        <LazyFranqueadoraPortal />
                      </SuspenseWrapper>
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirecionamentos para compatibilidade - com verificação condicional */}
                  <Route path="/sistema/*" element={<Navigate to="/unidade/dashboard" replace />} />
                  <Route path="/portal" element={<Navigate to="/" replace />} />
                  <Route path="/dashboard" element={<Navigate to="/unidade/dashboard" replace />} />
                  
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
