
import React from "react";
import { Button } from "@/components/ui/button";
import { Receipt, FileText, ArrowLeft, Printer } from "lucide-react";

interface VendaFinalizadaActionsProps {
  onImprimirRecibo: () => void;
  onImprimirGuias: () => void;
  onVoltarParaVendas: () => void;
  showRecibo: boolean;
  showGuias: boolean;
  quantidadeServicos: number;
}

const VendaFinalizadaActions: React.FC<VendaFinalizadaActionsProps> = ({
  onImprimirRecibo,
  onImprimirGuias,
  onVoltarParaVendas,
  showRecibo,
  showGuias,
  quantidadeServicos
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
      <div className="flex flex-1 gap-3">
        <Button
          onClick={onImprimirRecibo}
          disabled={showRecibo}
          className="flex-1 sm:flex-none"
          variant="outline"
        >
          {showRecibo ? (
            <Printer className="mr-2 h-4 w-4 animate-pulse" />
          ) : (
            <Receipt className="mr-2 h-4 w-4" />
          )}
          {showRecibo ? 'Imprimindo...' : 'Imprimir Recibo'}
        </Button>

        <Button
          onClick={onImprimirGuias}
          disabled={showGuias}
          className="flex-1 sm:flex-none"
          variant="outline"
        >
          {showGuias ? (
            <Printer className="mr-2 h-4 w-4 animate-pulse" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {showGuias ? 'Imprimindo...' : `Imprimir ${quantidadeServicos} Guia${quantidadeServicos > 1 ? 's' : ''}`}
        </Button>
      </div>

      <Button
        onClick={onVoltarParaVendas}
        className="flex-1 sm:flex-none"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Vendas
      </Button>
    </div>
  );
};

export default VendaFinalizadaActions;
