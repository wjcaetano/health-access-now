
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Edit, ShoppingCart } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Orcamento = Tables<"orcamentos">;

interface AcoesOrcamentoProps {
  orcamento: Orcamento;
  onCancelar: (id: string) => void;
  onConcluirVenda: (orcamento: Orcamento) => void;
  isLoading?: boolean;
}

const AcoesOrcamento: React.FC<AcoesOrcamentoProps> = ({
  orcamento,
  onCancelar,
  onConcluirVenda,
  isLoading = false
}) => {
  const navigate = useNavigate();
  
  const isExpired = new Date() > new Date(orcamento.data_validade);
  const isPendente = orcamento.status === 'pendente' && !isExpired;
  const isCancelado = orcamento.status === 'cancelado';
  const isAprovado = orcamento.status === 'aprovado';

  const handleAlterar = () => {
    // Navegar para edição do orçamento (implementar posteriormente)
    console.log('Alterar orçamento:', orcamento.id);
  };

  if (isCancelado) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-medium">Orçamento cancelado</p>
      </div>
    );
  }

  if (isExpired && orcamento.status === 'pendente') {
    return (
      <div className="text-center py-4">
        <p className="text-gray-600 font-medium">Orçamento expirado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isPendente && (
        <>
          <Button
            onClick={() => onConcluirVenda(orcamento)}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Concluir Venda
          </Button>

          <Button
            onClick={handleAlterar}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Alterar Orçamento
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Orçamento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja cancelar este orçamento? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Não</AlertDialogCancel>
                <AlertDialogAction onClick={() => onCancelar(orcamento.id)}>
                  Sim, Cancelar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {isAprovado && (
        <Button
          onClick={() => onConcluirVenda(orcamento)}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ir para Checkout
        </Button>
      )}
    </div>
  );
};

export default AcoesOrcamento;
