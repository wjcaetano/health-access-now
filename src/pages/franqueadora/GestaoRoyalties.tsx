
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { RoyaltiesTable } from "@/components/franqueadora/royalties/RoyaltiesTable";
import { RoyaltiesFilters } from "@/components/franqueadora/royalties/RoyaltiesFilters";
import { RoyaltiesMetrics } from "@/components/franqueadora/royalties/RoyaltiesMetrics";
import { RoyaltyDetails } from "@/components/franqueadora/royalties/RoyaltyDetails";
import { useRoyalties, useRoyaltiesMetrics, useConfirmPayment, useSendReminder, useRoyalty } from "@/hooks/useRoyalties";
import { useFranquias } from "@/hooks/useFranqueadora";
import { useToast } from "@/hooks/use-toast";

interface FiltersState {
  periodo: string;
  status: string;
  franquia: string;
  vencimento: string;
}

const GestaoRoyalties = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FiltersState>({
    periodo: 'todos',
    status: 'todos',
    franquia: 'todas',
    vencimento: 'todos'
  });
  const [selectedRoyaltyId, setSelectedRoyaltyId] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);

  // Queries
  const { data: royalties = [], isLoading: isLoadingRoyalties } = useRoyalties(filters);
  const { data: metrics, isLoading: isLoadingMetrics } = useRoyaltiesMetrics();
  const { data: franquias = [] } = useFranquias();
  const { data: selectedRoyalty } = useRoyalty(selectedRoyaltyId);

  // Mutations
  const confirmPaymentMutation = useConfirmPayment();
  const sendReminderMutation = useSendReminder();

  const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      periodo: 'todos',
      status: 'todos',
      franquia: 'todas',
      vencimento: 'todos'
    });
  };

  const handlePaymentConfirm = (royaltyId: string) => {
    confirmPaymentMutation.mutate(royaltyId);
  };

  const handleSendReminder = (royaltyId: string) => {
    sendReminderMutation.mutate(royaltyId);
  };

  const handleViewDetails = (royaltyId: string) => {
    setSelectedRoyaltyId(royaltyId);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedRoyaltyId("");
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportação iniciada",
      description: "O relatório será baixado em breve.",
    });
    // Aqui você implementaria a exportação real
  };

  const handleGenerateRoyalties = () => {
    toast({
      title: "Geração de royalties",
      description: "Esta funcionalidade será implementada em breve.",
    });
    // Aqui você implementaria a geração automática de royalties
  };

  // Métricas padrão para loading
  const defaultMetrics = {
    totalRoyalties: 0,
    royaltiesPagos: 0,
    royaltiesPendentes: 0,
    royaltiesAtrasados: 0,
    valorTotalRecebido: 0,
    valorTotalPendente: 0,
    valorTotalAtrasado: 0,
    percentualRecebimento: 0,
    crescimentoMensal: 0
  };

  const overduePendingCount = royalties.filter(r => 
    r.status === 'pendente' && new Date(r.data_vencimento) < new Date()
  ).length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Royalties</h1>
          <p className="text-muted-foreground">
            Controle completo de royalties e taxas das franquias
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overduePendingCount > 0 && (
            <Card className="px-3 py-2 border-red-200 bg-red-50">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {overduePendingCount} royalty(s) em atraso
                </span>
              </div>
            </Card>
          )}
          
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          
          <Button onClick={handleGenerateRoyalties}>
            <Plus className="h-4 w-4 mr-2" />
            Gerar Royalties
          </Button>
        </div>
      </div>

      {/* Métricas */}
      {!isLoadingMetrics && metrics && (
        <RoyaltiesMetrics metrics={metrics} />
      )}

      {/* Filtros */}
      <RoyaltiesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        franquias={franquias.map(f => ({ id: f.id, nome_fantasia: f.nome_fantasia }))}
      />

      {/* Tabela de Royalties */}
      {isLoadingRoyalties ? (
        <Card>
          <CardContent className="py-6">
            <div className="text-center">Carregando royalties...</div>
          </CardContent>
        </Card>
      ) : (
        <RoyaltiesTable
          royalties={royalties}
          onPaymentConfirm={handlePaymentConfirm}
          onSendReminder={handleSendReminder}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Modal de Detalhes */}
      <RoyaltyDetails
        royalty={selectedRoyalty}
        open={showDetails}
        onClose={handleCloseDetails}
        onConfirmPayment={handlePaymentConfirm}
        onSendReminder={handleSendReminder}
      />
    </div>
  );
};

export default GestaoRoyalties;
