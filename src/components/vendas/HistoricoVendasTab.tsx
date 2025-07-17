
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useVendas } from "@/hooks/useVendas";
import ListaVendas from "./ListaVendas";

const HistoricoVendasTab: React.FC = () => {
  const { data: vendas, isLoading: isLoadingVendas } = useVendas();

  if (isLoadingVendas) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agendaja-primary mx-auto"></div>
            <p className="text-gray-500 mt-2">Carregando vendas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <ListaVendas vendas={vendas || []} />;
};

export default HistoricoVendasTab;
