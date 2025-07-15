
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Login from "@/pages/auth/Login";
import Index from "@/pages/Index";
import Vendas from "@/pages/Vendas";
import Agendamentos from "@/pages/Agendamentos";
import NovoAgendamento from "@/pages/NovoAgendamento";
import Clientes from "@/pages/Clientes";
import NovoCliente from "@/pages/NovoCliente";
import Prestadores from "@/pages/Prestadores";
import NovoPrestador from "@/pages/NovoPrestador";
import Servicos from "@/pages/Servicos";
import NovoServico from "@/pages/NovoServico";
import Orcamentos from "@/pages/Orcamentos";
import VisualizarOrcamento from "@/pages/VisualizarOrcamento";
import Guias from "@/pages/Guias";
import Conversas from "@/pages/Conversas";
import Colaboradores from "@/pages/Colaboradores";
import GestaoUsuarios from "@/pages/GestaoUsuarios";
import MeuPerfil from "@/pages/MeuPerfil";
import Financeiro from "@/pages/Financeiro";
import SystemSettings from "@/pages/SystemSettings";
import ReportsPage from "@/pages/ReportsPage";
import BackupPage from "@/pages/BackupPage";
import AnaliseDoSistema from "@/pages/AnaliseDoSistema";
import AdvancedDashboard from "@/pages/AdvancedDashboard";
import CheckoutVendas from "@/pages/CheckoutVendas";
import VendaFinalizada from "@/pages/VendaFinalizada";
import AgendaPagamentos from "@/pages/AgendaPagamentos";
import NotFound from "@/pages/NotFound";

// Páginas da Franqueadora
import DashboardFranqueadora from "@/pages/franqueadora/DashboardFranqueadora";
import GestaoFranquias from "@/pages/franqueadora/GestaoFranquias";
import LeadsFranqueados from "@/pages/franqueadora/LeadsFranqueados";
import CRMFranqueados from "@/pages/franqueadora/CRMFranqueados";
import FinanceiroMatriz from "@/pages/franqueadora/FinanceiroMatriz";
import GestaoRoyalties from "@/pages/franqueadora/GestaoRoyalties";
import GestaoContratos from "@/pages/franqueadora/GestaoContratos";
import RelatoriosExecutivos from "@/pages/franqueadora/RelatoriosExecutivos";
import MetasKPIs from "@/pages/franqueadora/MetasKPIs";
import ExpansaoFranquias from "@/pages/franqueadora/ExpansaoFranquias";

// Páginas do Prestador
import PortalPrestador from "@/pages/prestador/Portal";
import GuiasPrestador from "@/pages/prestador/Guias";
import FaturamentoPrestador from "@/pages/prestador/Faturamento";

// Páginas de Serviços
import ConsultasMedicas from "@/pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "@/pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "@/pages/servicos/ExamesDeImagem";
import OutrosExames from "@/pages/servicos/OutrosExames";

// Páginas Públicas
import PaginaDeVendas from "@/pages/PaginaDeVendas";
import PortalParceiro from "@/pages/parceiros/PortalParceiro";
import SejaFranqueado from "@/pages/franquia/SejaFranqueado";

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
      <ThemeProvider defaultTheme="light" storageKey="agendaja-theme">
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/vendas-publico" element={<PaginaDeVendas />} />
                <Route path="/portal-parceiro" element={<PortalParceiro />} />
                <Route path="/seja-franqueado" element={<SejaFranqueado />} />
                
                {/* Rotas Protegidas */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Index />} />
                  
                  {/* Rotas da Franqueadora */}
                  <Route path="franqueadora/dashboard" element={<DashboardFranqueadora />} />
                  <Route path="franqueadora/franquias" element={<GestaoFranquias />} />
                  <Route path="franqueadora/leads" element={<LeadsFranqueados />} />
                  <Route path="franqueadora/franqueados" element={<CRMFranqueados />} />
                  <Route path="franqueadora/financeiro" element={<FinanceiroMatriz />} />
                  <Route path="franqueadora/royalties" element={<GestaoRoyalties />} />
                  <Route path="franqueadora/contratos" element={<GestaoContratos />} />
                  <Route path="franqueadora/relatorios" element={<RelatoriosExecutivos />} />
                  <Route path="franqueadora/metas" element={<MetasKPIs />} />
                  <Route path="franqueadora/expansao" element={<ExpansaoFranquias />} />
                  
                  {/* Rotas Operacionais */}
                  <Route path="vendas" element={<Vendas />} />
                  <Route path="checkout" element={<CheckoutVendas />} />
                  <Route path="venda-finalizada/:vendaId" element={<VendaFinalizada />} />
                  <Route path="agendamentos" element={<Agendamentos />} />
                  <Route path="agendamentos/novo" element={<NovoAgendamento />} />
                  <Route path="clientes" element={<Clientes />} />
                  <Route path="clientes/novo" element={<NovoCliente />} />
                  <Route path="prestadores" element={<Prestadores />} />
                  <Route path="prestadores/novo" element={<NovoPrestador />} />
                  <Route path="servicos" element={<Servicos />} />
                  <Route path="servicos/novo" element={<NovoServico />} />
                  <Route path="orcamentos" element={<Orcamentos />} />
                  <Route path="orcamentos/:id" element={<VisualizarOrcamento />} />
                  <Route path="guias" element={<Guias />} />
                  <Route path="conversas" element={<Conversas />} />
                  
                  {/* Rotas de Prestador */}
                  <Route path="prestador/portal" element={<PortalPrestador />} />
                  <Route path="prestador/guias" element={<GuiasPrestador />} />
                  <Route path="prestador/faturamento" element={<FaturamentoPrestador />} />
                  
                  {/* Rotas de Serviços */}
                  <Route path="servicos/consultas-medicas" element={<ConsultasMedicas />} />
                  <Route path="servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
                  <Route path="servicos/exames-imagem" element={<ExamesDeImagem />} />
                  <Route path="servicos/outros-exames" element={<OutrosExames />} />
                  
                  {/* Rotas Administrativas */}
                  <Route path="financeiro" element={<Financeiro />} />
                  <Route path="agenda-pagamentos" element={<AgendaPagamentos />} />
                  <Route path="colaboradores" element={<Colaboradores />} />
                  <Route path="usuarios" element={<GestaoUsuarios />} />
                  <Route path="perfil" element={<MeuPerfil />} />
                  <Route path="configuracoes" element={<SystemSettings />} />
                  <Route path="relatorios" element={<ReportsPage />} />
                  <Route path="backup" element={<BackupPage />} />
                  <Route path="analise-sistema" element={<AnaliseDoSistema />} />
                  <Route path="dashboard-avancado" element={<AdvancedDashboard />} />
                </Route>
                
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
