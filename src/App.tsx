
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PasswordChangeGuard from "@/components/auth/PasswordChangeGuard";
import Layout from "@/components/layout/Layout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Clientes from "@/pages/Clientes";
import NovoCliente from "@/pages/NovoCliente";
import Prestadores from "@/pages/Prestadores";
import NovoPrestador from "@/pages/NovoPrestador";
import Servicos from "@/pages/Servicos";
import NovoServico from "@/pages/NovoServico";
import Orcamentos from "@/pages/Orcamentos";
import VisualizarOrcamento from "@/pages/VisualizarOrcamento";
import Vendas from "@/pages/Vendas";
import CheckoutVendas from "@/pages/CheckoutVendas";
import VendaFinalizada from "@/pages/VendaFinalizada";
import Agendamentos from "@/pages/Agendamentos";
import NovoAgendamento from "@/pages/NovoAgendamento";
import Colaboradores from "@/pages/Colaboradores";
import Financeiro from "@/pages/Financeiro";
import AgendaPagamentos from "@/pages/AgendaPagamentos";
import Guias from "@/pages/Guias";
import Conversas from "@/pages/Conversas";
import GestaoUsuarios from "@/pages/GestaoUsuarios";
import MeuPerfil from "@/pages/MeuPerfil";
import AnaliseDoSistema from "@/pages/AnaliseDoSistema";
import NotFound from "@/pages/NotFound";

// Service pages
import ConsultasMedicas from "@/pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "@/pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "@/pages/servicos/ExamesDeImagem";
import OutrosExames from "@/pages/servicos/OutrosExames";

// Portal pages
import PaginaDeVendas from "@/pages/PaginaDeVendas";
import PortalParceiro from "@/pages/parceiros/PortalParceiro";
import Portal from "@/pages/prestador/Portal";
import Faturamento from "@/pages/prestador/Faturamento";
import GuiasPrestador from "@/pages/prestador/Guias";
import SejaFranqueado from "@/pages/franquia/SejaFranqueado";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/vendas-publicas" element={<PaginaDeVendas />} />
            <Route path="/portal-parceiro" element={<PortalParceiro />} />
            <Route path="/seja-franqueado" element={<SejaFranqueado />} />
            
            {/* Service pages */}
            <Route path="/servicos/consultas-medicas" element={<ConsultasMedicas />} />
            <Route path="/servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
            <Route path="/servicos/exames-de-imagem" element={<ExamesDeImagem />} />
            <Route path="/servicos/outros-exames" element={<OutrosExames />} />
            
            {/* Prestador portal */}
            <Route path="/prestador/portal" element={<Portal />} />
            <Route path="/prestador/faturamento" element={<Faturamento />} />
            <Route path="/prestador/guias" element={<GuiasPrestador />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <PasswordChangeGuard>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/novo-cliente" element={<NovoCliente />} />
                        <Route path="/editar-cliente/:id" element={<NovoCliente />} />
                        <Route path="/prestadores" element={<Prestadores />} />
                        <Route path="/novo-prestador" element={<NovoPrestador />} />
                        <Route path="/editar-prestador/:id" element={<NovoPrestador />} />
                        <Route path="/servicos" element={<Servicos />} />
                        <Route path="/novo-servico" element={<NovoServico />} />
                        <Route path="/editar-servico/:id" element={<NovoServico />} />
                        <Route path="/orcamentos" element={<Orcamentos />} />
                        <Route path="/orcamento/:id" element={<VisualizarOrcamento />} />
                        <Route path="/vendas" element={<Vendas />} />
                        <Route path="/checkout-vendas" element={<CheckoutVendas />} />
                        <Route path="/venda-finalizada" element={<VendaFinalizada />} />
                        <Route path="/agendamentos" element={<Agendamentos />} />
                        <Route path="/novo-agendamento" element={<NovoAgendamento />} />
                        <Route path="/colaboradores" element={<Colaboradores />} />
                        <Route path="/financeiro" element={<Financeiro />} />
                        <Route path="/agenda-pagamentos" element={<AgendaPagamentos />} />
                        <Route path="/guias" element={<Guias />} />
                        <Route path="/conversas" element={<Conversas />} />
                        <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
                        <Route path="/meu-perfil" element={<MeuPerfil />} />
                        <Route path="/analise-sistema" element={<AnaliseDoSistema />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </PasswordChangeGuard>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
