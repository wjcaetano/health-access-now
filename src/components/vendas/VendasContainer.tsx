
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";
import { useOrcamentosPorCliente, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useVendaLogic } from "@/hooks/useVendaLogic";
import { useToast } from "@/hooks/use-toast";
import NovaVendaTab from "./NovaVendaTab";
import HistoricoVendasTab from "./HistoricoVendasTab";
import OrcamentosPendentes from "./OrcamentosPendentes";

const VendasContainer: React.FC = () => {
  const { isMobile, getContainerPadding } = useResponsiveLayout();
  const { toast } = useToast();
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();
  
  // Use a mock client ID for now - in real implementation this would come from state
  const clienteId = ""; // Empty string to fetch no orçamentos for the standalone tab
  const { data: orcamentos = [] } = useOrcamentosPorCliente(clienteId);
  
  const { concluirVendaDoOrcamento } = useVendaLogic();

  const handleConcluirVenda = (orcamento: any) => {
    concluirVendaDoOrcamento(orcamento);
  };

  const handleCancelar = (orcamentoId: string) => {
    cancelarOrcamento(orcamentoId, {
      onSuccess: () => {
        toast({
          title: "Orçamento cancelado",
          description: "O orçamento foi cancelado com sucesso."
        });
      },
      onError: (error) => {
        console.error('Erro ao cancelar orçamento:', error);
        toast({
          title: "Erro ao cancelar",
          description: "Ocorreu um erro ao cancelar o orçamento.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className={`space-y-4 ${getContainerPadding()} min-h-0 overflow-hidden`}>
      <div className="space-y-2">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
          Vendas
        </h2>
        <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-base'}`}>
          Gerencie vendas, orçamentos e histórico de transações
        </p>
      </div>

      <Tabs defaultValue="nova-venda" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 ${isMobile ? 'h-9 text-xs' : 'h-10'}`}>
          <TabsTrigger value="nova-venda" className={isMobile ? 'text-xs px-2' : ''}>
            {isMobile ? 'Nova' : 'Nova Venda'}
          </TabsTrigger>
          <TabsTrigger value="orcamentos" className={isMobile ? 'text-xs px-2' : ''}>
            Orçamentos
          </TabsTrigger>
          <TabsTrigger value="historico" className={isMobile ? 'text-xs px-2' : ''}>
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova-venda" className="mt-4 space-y-4 min-h-0">
          <NovaVendaTab />
        </TabsContent>

        <TabsContent value="orcamentos" className="mt-4 space-y-4 min-h-0">
          <OrcamentosPendentes
            orcamentos={orcamentos}
            onConcluirVenda={handleConcluirVenda}
            onCancelar={handleCancelar}
            isLoading={isCancelingOrcamento}
          />
        </TabsContent>

        <TabsContent value="historico" className="mt-4 space-y-4 min-h-0">
          <HistoricoVendasTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendasContainer;
