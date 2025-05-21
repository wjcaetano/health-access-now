
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Clientes from "./pages/Clientes";
import NovoCliente from "./pages/NovoCliente";
import Agendamentos from "./pages/Agendamentos";
import NovoAgendamento from "./pages/NovoAgendamento";
import Orcamentos from "./pages/Orcamentos";
import Conversas from "./pages/Conversas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="novo-cliente" element={<NovoCliente />} />
            <Route path="agendamentos" element={<Agendamentos />} />
            <Route path="novo-agendamento" element={<NovoAgendamento />} />
            <Route path="orcamentos" element={<Orcamentos />} />
            <Route path="conversas" element={<Conversas />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
