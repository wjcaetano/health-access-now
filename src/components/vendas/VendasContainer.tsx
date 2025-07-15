
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Eye } from "lucide-react";
import NovaVendaTab from "./NovaVendaTab";
import HistoricoVendasTab from "./HistoricoVendasTab";

const VendasContainer: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Vendas</h2>
        <p className="text-gray-500 mt-1">
          Gerencie vendas, orçamentos e visualize o histórico de transações
        </p>
      </div>

      <Tabs defaultValue="nova-venda" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nova-venda" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Nova Venda
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Histórico de Vendas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-venda" className="space-y-6">
          <NovaVendaTab />
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <HistoricoVendasTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendasContainer;
