
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer, FileText, ArrowLeft } from "lucide-react";

interface VendaActionsProps {
  onImprimirRecibo: () => void;
  onImprimirGuias: () => void;
  onVoltarParaVendas: () => void;
  showRecibo: boolean;
  showGuias: boolean;
  quantidadeServicos: number;
}

const VendaActions: React.FC<VendaActionsProps> = ({
  onImprimirRecibo,
  onImprimirGuias,
  onVoltarParaVendas,
  showRecibo,
  showGuias,
  quantidadeServicos
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        onClick={onImprimirRecibo}
        className="flex-1 bg-blue-600 hover:bg-blue-700"
        disabled={showRecibo}
      >
        <Printer className="h-4 w-4 mr-2" />
        {showRecibo ? "Preparando..." : "Imprimir Recibo"}
      </Button>
      
      <Button
        onClick={onImprimirGuias}
        className="flex-1 bg-green-600 hover:bg-green-700"
        disabled={showGuias}
      >
        <FileText className="h-4 w-4 mr-2" />
        {showGuias ? "Preparando..." : `Imprimir Guias (${quantidadeServicos})`}
      </Button>
      
      <Button
        onClick={onVoltarParaVendas}
        variant="outline"
        className="flex-1"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar para Vendas
      </Button>
    </div>
  );
};

export default VendaActions;
