
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Plus, ShoppingCart, Edit, XCircle } from "lucide-react";
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
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tables } from "@/integrations/supabase/types";

type Orcamento = Tables<"orcamentos">;

interface OrcamentoPendente extends Orcamento {
  servicos?: {
    nome: string;
    categoria: string;
  };
  prestadores?: {
    nome: string;
  };
}

interface OrcamentosPendentesProps {
  orcamentos: OrcamentoPendente[];
  onConcluirVenda: (orcamento: OrcamentoPendente) => void;
  onCancelar: (id: string) => void;
  isLoading?: boolean;
}

const OrcamentosPendentes: React.FC<OrcamentosPendentesProps> = ({
  orcamentos,
  onConcluirVenda,
  onCancelar,
  isLoading = false
}) => {
  if (orcamentos.length === 0) {
    return null;
  }

  const getStatusColor = (orcamento: OrcamentoPendente) => {
    const isExpired = new Date() > new Date(orcamento.data_validade);
    if (isExpired) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusLabel = (orcamento: OrcamentoPendente) => {
    const isExpired = new Date() > new Date(orcamento.data_validade);
    if (isExpired) return "Expirado";
    return "Pendente";
  };

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-800">
          <FileText className="h-5 w-5 mr-2" />
          Orçamentos Pendentes ({orcamentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orcamentos.map((orcamento) => {
            const isExpired = new Date() > new Date(orcamento.data_validade);
            
            return (
              <div
                key={orcamento.id}
                className="p-4 bg-white border border-amber-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">
                        {orcamento.servicos?.nome || "Serviço"}
                      </h4>
                      <Badge variant="outline" className={getStatusColor(orcamento)}>
                        {getStatusLabel(orcamento)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {orcamento.prestadores?.nome || "Prestador"}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Criado: {format(new Date(orcamento.created_at || ''), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Válido até: {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="font-semibold text-green-600">
                      R$ {orcamento.valor_final.toFixed(2)}
                    </p>
                  </div>
                </div>

                {!isExpired && orcamento.status === 'pendente' && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      onClick={() => onConcluirVenda(orcamento)}
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      disabled={isLoading}
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Concluir Venda
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                          disabled={isLoading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelar
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
                  </div>
                )}

                {isExpired && (
                  <div className="text-center py-2">
                    <p className="text-red-600 text-sm font-medium">
                      Este orçamento expirou
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrcamentosPendentes;
