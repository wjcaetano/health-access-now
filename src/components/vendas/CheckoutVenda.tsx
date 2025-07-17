
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  FileText,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";

interface ServicoSelecionado {
  id: string;
  nome: string;
  categoria: string;
  prestadorId: string;
  prestadorNome: string;
  valorVenda: number;
  descricao?: string;
}

interface CheckoutVendaProps {
  servicos: ServicoSelecionado[];
  cliente: any;
  onVoltar: () => void;
  onConcluirVenda: (metodoPagamento: string, observacoes?: string) => void;
  isLoading?: boolean;
}

const formasPagamento = [
  { id: "pix", label: "PIX", icon: Smartphone },
  { id: "cartao", label: "Cartão", icon: CreditCard },
  { id: "dinheiro", label: "Dinheiro", icon: Banknote },
  { id: "boleto", label: "Boleto", icon: FileText },
];

const CheckoutVenda: React.FC<CheckoutVendaProps> = ({
  servicos,
  cliente,
  onVoltar,
  onConcluirVenda,
  isLoading = false
}) => {
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [observacoes, setObservacoes] = useState("");

  const valorTotal = servicos.reduce((total, servico) => total + servico.valorVenda, 0);

  const handleConcluirVenda = () => {
    onConcluirVenda(metodoPagamento, observacoes || undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onVoltar}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h3 className="text-2xl font-bold">Checkout da Venda</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumo da Venda */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Venda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cliente */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Cliente</h4>
              <p className="text-blue-700">{cliente.nome}</p>
              <p className="text-sm text-blue-600">CPF: {cliente.cpf}</p>
            </div>

            {/* Serviços */}
            <div>
              <h4 className="font-semibold mb-3">Serviços ({servicos.length})</h4>
              <div className="space-y-3">
                {servicos.map((servico, index) => (
                  <div
                    key={`${servico.id}-${index}`}
                    className="flex justify-between items-start p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium">{servico.nome}</h5>
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
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span className="text-green-600">R$ {valorTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forma de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={metodoPagamento} onValueChange={setMetodoPagamento}>
              <div className="grid grid-cols-2 gap-4">
                {formasPagamento.map((forma) => (
                  <Label
                    key={forma.id}
                    htmlFor={forma.id}
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      metodoPagamento === forma.id
                        ? "border-agendaja-primary bg-agendaja-light"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem
                      value={forma.id}
                      id={forma.id}
                      className="sr-only"
                    />
                    <forma.icon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">{forma.label}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes" className="text-sm font-medium">
                Observações (opcional)
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Adicione observações sobre a venda..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>

            {/* Botão de Conclusão */}
            <Button
              onClick={handleConcluirVenda}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={isLoading}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isLoading ? "Processando..." : `Concluir Venda - R$ ${valorTotal.toFixed(2)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutVenda;
