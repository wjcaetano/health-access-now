import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import NovoCliente from "./pages/NovoCliente";
import Vendas from "./pages/Vendas"; // Alterado de Agendamentos para Vendas
import NovoAgendamento from "./pages/NovoAgendamento";
import Orcamentos from "./pages/Orcamentos";
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

// Área de autenticação
import Login from "./pages/auth/Login";

import CheckoutVendas from "./pages/CheckoutVendas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Autenticação */}
          <Route path="/login" element={<Login />} />
          
          {/* Layout padrão AGENDAJA (atendentes e gerentes) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            
            {/* Rotas do MVP original */}
            <Route path="clientes" element={<Clientes />} />
            <Route path="novo-cliente" element={<NovoCliente />} />
            <Route path="vendas" element={<Vendas />} />
            <Route path="checkout-vendas" element={<CheckoutVendas />} />
            <Route path="novo-agendamento" element={<NovoAgendamento />} />
            <Route path="orcamentos" element={<Orcamentos />} />
            <Route path="conversas" element={<Conversas />} />
            
            {/* Novas rotas para o SaaS */}
            <Route path="prestadores" element={<Prestadores />} />
            <Route path="novo-prestador" element={<NovoPrestador />} />
            <Route path="servicos" element={<Servicos />} />
            <Route path="novo-servico" element={<NovoServico />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="agenda-pagamentos" element={<AgendaPagamentos />} />
            <Route path="guias" element={<Guias />} />
          </Route>
          
          {/* Layout para prestadores */}
          <Route path="/prestador" element={<Layout />}>
            <Route index element={<PortalPrestador />} />
            <Route path="guias" element={<GuiasPrestador />} />
            <Route path="faturamento" element={<FaturamentoPrestador />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
