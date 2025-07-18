
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

// Portais específicos
import UnidadePortal from "@/components/portals/UnidadePortal";
import PrestadorPortal from "@/components/portals/PrestadorPortal";
import FranqueadoraPortal from "@/components/portals/FranqueadoraPortal";

// Páginas públicas
import PaginaDeVendas from "@/pages/PaginaDeVendas";
import PortalParceiro from "@/pages/parceiros/PortalParceiro";
import SejaFranqueado from "@/pages/franquia/SejaFranqueado";

// Páginas de serviços públicas
import ConsultasMedicas from "@/pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "@/pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "@/pages/servicos/ExamesDeImagem";
import OutrosExames from "@/pages/servicos/OutrosExames";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Rota Principal - Página Pública */}
                <Route path="/" element={<PaginaDeVendas />} />
                
                {/* Páginas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/portal-parceiro" element={<PortalParceiro />} />
                <Route path="/seja-franqueado" element={<SejaFranqueado />} />
                
                {/* Páginas de Serviços Públicas */}
                <Route path="/servicos/consultas-medicas" element={<ConsultasMedicas />} />
                <Route path="/servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
                <Route path="/servicos/exames-de-imagem" element={<ExamesDeImagem />} />
                <Route path="/servicos/outros-exames" element={<OutrosExames />} />
                
                {/* Portal da Unidade/Franquia - Atendentes, Gerentes, Admins Locais */}
                <Route path="/unidade/*" element={
                  <ProtectedRoute>
                    <UnidadePortal />
                  </ProtectedRoute>
                } />
                
                {/* Portal do Prestador - Apenas Prestadores */}
                <Route path="/prestador/*" element={
                  <ProtectedRoute>
                    <PrestadorPortal />
                  </ProtectedRoute>
                } />
                
                {/* Portal da Franqueadora - Apenas Admins da Matriz */}
                <Route path="/franqueadora/*" element={
                  <ProtectedRoute requireAdmin>
                    <FranqueadoraPortal />
                  </ProtectedRoute>
                } />
                
                {/* Redirecionamento baseado no perfil do usuário */}
                <Route path="/sistema" element={<Navigate to="/unidade" replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <SonnerToaster />
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
