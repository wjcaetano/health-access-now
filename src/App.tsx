
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { PasswordChangeGuard } from "./components/auth/PasswordChangeGuard";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import NovoCliente from "./pages/NovoCliente";
import Vendas from "./pages/Vendas";
import NovoAgendamento from "./pages/NovoAgendamento";
import Orcamentos from "./pages/Orcamentos";
import VisualizarOrcamento from "./pages/VisualizarOrcamento";
import Conversas from "./pages/Conversas";
import NotFound from "./pages/NotFound";

// Novas páginas
import Prestadores from "./pages/Prestadores";
import NovoPrestador from "./pages/NovoPrestador";
import Servicos from "./pages/Servicos";
import NovoServico from "./pages/NovoServico";
import Financeiro from "./pages/Financeiro";
import AgendaPagamentos from "./pages/AgendaPagamentos";
import Guias from "./pages/Guias";
import PortalPrestador from "./pages/prestador/Portal";
import GuiasPrestador from "./pages/prestador/Guias";
import FaturamentoPrestador from "./pages/prestador/Faturamento";

// Páginas da área pública/vendas
import ConsultasMedicas from "./pages/servicos/ConsultasMedicas";
import ExamesLaboratoriais from "./pages/servicos/ExamesLaboratoriais";
import ExamesDeImagem from "./pages/servicos/ExamesDeImagem";
import OutrosExames from "./pages/servicos/OutrosExames";
import PortalParceiro from "./pages/parceiros/PortalParceiro";
import SejaFranqueado from "./pages/franquia/SejaFranqueado";

// Área de autenticação
import Login from "./pages/auth/Login";
import TrocaSenhaObrigatoria from "./components/auth/TrocaSenhaObrigatoria";

import CheckoutVendas from "./pages/CheckoutVendas";
import PaginaDeVendas from "./pages/PaginaDeVendas";
import Colaboradores from "./pages/Colaboradores";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import MeuPerfil from "./pages/MeuPerfil";
import AnaliseDoSistema from "./pages/AnaliseDoSistema";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<PaginaDeVendas mostrarLogin />} />
            <Route path="/vender" element={<PaginaDeVendas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/servicos/consultas" element={<ConsultasMedicas />} />
            <Route path="/servicos/exames-laboratoriais" element={<ExamesLaboratoriais />} />
            <Route path="/servicos/exames-imagem" element={<ExamesDeImagem />} />
            <Route path="/servicos/outros-exames" element={<OutrosExames />} />
            <Route path="/portal-parceiro" element={<PortalParceiro />} />
            <Route path="/seja-franqueado" element={<SejaFranqueado />} />
            
            {/* Rota de troca de senha obrigatória */}
            <Route path="/troca-senha-obrigatoria" element={<TrocaSenhaObrigatoria />} />
            
            {/* Layout padrão AGENDAJA (atendentes e gerentes) - com proteção de senha */}
            <Route element={
              <PasswordChangeGuard>
                <Layout />
              </PasswordChangeGuard>
            }>
              <Route path="/dashboard" element={<Index />} />
              
              {/* Rotas do MVP original */}
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/novo-cliente" element={<NovoCliente />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/checkout-vendas" element={<CheckoutVendas />} />
              <Route path="/novo-agendamento" element={<NovoAgendamento />} />
              <Route path="/orcamentos" element={<Orcamentos />} />
              <Route path="/orcamentos/:id" element={<VisualizarOrcamento />} />
              <Route path="/conversas" element={<Conversas />} />
              
              {/* Novas rotas para o SaaS */}
              <Route path="/prestadores" element={<Prestadores />} />
              <Route path="/novo-prestador" element={<NovoPrestador />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/novo-servico" element={<NovoServico />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/agenda-pagamentos" element={<AgendaPagamentos />} />
              <Route path="/guias" element={<Guias />} />

              {/* Gestão de colaboradores */}
              <Route path="/colaboradores" element={<Colaboradores />} />
              
              {/* Gestão de usuários e perfil */}
              <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
              <Route path="/meu-perfil" element={<MeuPerfil />} />
              <Route path="/analise-sistema" element={<AnaliseDoSistema />} />
            </Route>
            
            {/* Layout para prestadores - com proteção de senha */}
            <Route path="/prestador" element={
              <PasswordChangeGuard>
                <Layout />
              </PasswordChangeGuard>
            }>
              <Route index element={<PortalPrestador />} />
              <Route path="guias" element={<GuiasPrestador />} />
              <Route path="faturamento" element={<FaturamentoPrestador />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
