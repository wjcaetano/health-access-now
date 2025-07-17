
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";

interface CancelamentoGuiaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guia: any;
  guiasRelacionadas: any[];
  onConfirm: () => void;
  isLoading: boolean;
}

const CancelamentoGuiaModal: React.FC<CancelamentoGuiaModalProps> = ({
  open,
  onOpenChange,
  guia,
  guiasRelacionadas,
  onConfirm,
  isLoading
}) => {
  const valorTotalCancelamento = guiasRelacionadas.reduce((acc, g) => acc + (g.valor || 0), 0);
  const vendaInfo = Array.isArray(guia?.vendas_servicos) ? guia.vendas_servicos[0] : null;
  const codigoPedido = vendaInfo?.venda_id?.slice(0, 8).toUpperCase() || 'N/A';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            ⚠️ Cancelar Pedido Completo
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Ao cancelar esta guia, <strong>todo o pedido {codigoPedido}</strong> será cancelado, 
                incluindo todas as guias relacionadas.
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <h4 className="font-medium text-orange-800 mb-2">
                  Guias que serão canceladas:
                </h4>
                <div className="space-y-2">
                  {guiasRelacionadas.map((g, index) => (
                    <div key={g.id} className="flex justify-between items-center text-sm">
                      <span className="truncate">{g.servicos?.nome}</span>
                      <Badge variant="outline" className="text-xs">
                        {formatCurrency(g.valor)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-orange-200">
                  <div className="flex justify-between items-center font-medium text-orange-800">
                    <span>Total a estornar:</span>
                    <span>{formatCurrency(valorTotalCancelamento)}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">
                ✅ A venda será marcada como cancelada<br/>
                ✅ O valor será estornado automaticamente<br/>
                ✅ Todas as guias relacionadas serão canceladas
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Manter Pedido
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Cancelando..." : "Confirmar Cancelamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelamentoGuiaModal;
