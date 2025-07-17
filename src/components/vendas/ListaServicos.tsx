
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, X } from "lucide-react";

interface ServicoSelecionado {
  id: string;
  nome: string;
  categoria: string;
  prestadorId: string;
  prestadorNome: string;
  valorVenda: number;
  descricao?: string;
}

interface ListaServicosProps {
  servicos: ServicoSelecionado[];
  onRemoverServico: (index: number) => void;
  onLimparLista: () => void;
}

const ListaServicos: React.FC<ListaServicosProps> = ({
  servicos,
  onRemoverServico,
  onLimparLista
}) => {
  const valorTotal = servicos.reduce((total, servico) => total + servico.valorVenda, 0);

  if (servicos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Serviços Selecionados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum serviço selecionado ainda</p>
            <p className="text-sm">Use a busca acima para adicionar serviços</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Serviços Selecionados ({servicos.length})</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onLimparLista}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Lista
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {servicos.map((servico, index) => (
            <div
              key={`${servico.id}-${index}`}
              className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{servico.nome}</h4>
                    <p className="text-sm text-gray-600">{servico.categoria}</p>
                    <p className="text-sm text-blue-600">{servico.prestadorNome}</p>
                    {servico.descricao && (
                      <p className="text-xs text-gray-500 mt-1">{servico.descricao}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      R$ {servico.valorVenda.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoverServico(index)}
                className="ml-4 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Total */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span className="text-green-600">R$ {valorTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListaServicos;
