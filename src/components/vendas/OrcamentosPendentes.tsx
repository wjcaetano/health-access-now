
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrcamentoPendente {
  id: string;
  valor_final: number;
  data_validade: string;
  created_at: string;
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
  onAdicionarOrcamento: (orcamentoId: string) => void;
}

const OrcamentosPendentes: React.FC<OrcamentosPendentesProps> = ({
  orcamentos,
  onAdicionarOrcamento
}) => {
  if (orcamentos.length === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-800">
          <FileText className="h-5 w-5 mr-2" />
          Orçamentos Pendentes ({orcamentos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orcamentos.map((orcamento) => (
            <div
              key={orcamento.id}
              className="flex items-center justify-between p-3 bg-white border border-amber-200 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">
                    {orcamento.servicos?.nome || "Serviço"}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {orcamento.servicos?.categoria || ""}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {orcamento.prestadores?.nome || "Prestador"}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Criado: {format(new Date(orcamento.created_at), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Válido até: {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    R$ {orcamento.valor_final.toFixed(2)}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onAdicionarOrcamento(orcamento.id)}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Usar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrcamentosPendentes;
