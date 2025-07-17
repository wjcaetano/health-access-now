
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface SalesSummaryProps {
  dadosVenda: any;
}

const SalesSummary: React.FC<SalesSummaryProps> = ({ dadosVenda }) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const calcularTotal = () => {
    if (!dadosVenda?.servicos) return 0;
    return dadosVenda.servicos.reduce((total: number, servico: any) => total + servico.valorVenda, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
        <CardDescription>
          Confirme os dados antes de processar o pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dados do Cliente */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <User className="h-5 w-5 text-agendaja-primary mr-2" />
            <h4 className="font-medium">Cliente</h4>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sm">{dadosVenda.cliente.nome}</p>
            <p className="text-xs text-gray-600">{dadosVenda.cliente.telefone}</p>
            <p className="text-xs text-gray-600">CPF: {dadosVenda.cliente.cpf}</p>
          </div>
        </div>

        {/* Lista de Serviços */}
        <div>
          <h4 className="font-medium mb-3">Serviços Contratados</h4>
          <div className="space-y-3">
            {dadosVenda.servicos.map((servico: any, index: number) => (
              <Card key={index} className="border-l-4 border-l-agendaja-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm">{servico.nome}</h5>
                    <span className="font-semibold text-agendaja-primary text-sm">
                      {formatarMoeda(servico.valorVenda)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">
                    Categoria: {servico.categoria}
                  </p>
                  <p className="text-xs text-gray-600">
                    Prestador: {servico.prestadorNome}
                  </p>
                  {servico.descricao && (
                    <p className="text-xs text-gray-500 mt-1">{servico.descricao}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-agendaja-primary">
              {formatarMoeda(calcularTotal())}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
