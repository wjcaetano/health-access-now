
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

interface AcoesFinaisVendaProps {
  onConcluirVenda: () => void;
  onSalvarOrcamento: () => void;
  onCancelar: () => void;
  servicosSelecionados: number;
}

const AcoesFinaisVenda: React.FC<AcoesFinaisVendaProps> = ({
  onConcluirVenda,
  onSalvarOrcamento,
  onCancelar,
  servicosSelecionados
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onConcluirVenda}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={servicosSelecionados === 0}
          >
            Concluir Venda
          </Button>
          <Button
            onClick={onSalvarOrcamento}
            variant="outline"
            className="flex-1"
            disabled={servicosSelecionados === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Orçamento (7 dias)
          </Button>
          <Button
            onClick={onCancelar}
            variant="outline"
            className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
          >
            Cancelar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcoesFinaisVenda;
