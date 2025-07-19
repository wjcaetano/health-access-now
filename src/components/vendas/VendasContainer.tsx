
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import NovaVendaTab from "./NovaVendaTab";
import HistoricoVendasTab from "./HistoricoVendasTab";

const VendasContainer: React.FC = () => {
  const { isMobile, getContainerPadding } = useResponsiveLayout();

  return (
    <div className={`space-y-4 ${getContainerPadding()} min-h-0 overflow-hidden`}>
      <header className="space-y-2">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
          Vendas
        </h2>
        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Gerencie vendas, orçamentos e histórico de transações
        </p>
      </header>

      <Tabs defaultValue="nova-venda" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 ${isMobile ? 'h-9 text-xs' : 'h-10'}`}>
          <TabsTrigger value="nova-venda" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? 'Nova' : 'Nova Venda'}
          </TabsTrigger>
          <TabsTrigger value="historico" className={isMobile ? 'text-xs px-2' : ''}>
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-venda" className="mt-4 space-y-4 min-h-0">
          <NovaVendaTab />
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-4 min-h-0">
          <HistoricoVendasTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendasContainer;
