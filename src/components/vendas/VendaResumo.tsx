
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VendaResumoProps {
  venda: any;
  cliente: any;
  servicos: any[];
  metodoPagamento: string;
  gerarCodigoGuia: (vendaId: string, index: number) => string;
}

const VendaResumo: React.FC<VendaResumoProps> = ({
  venda,
  cliente,
  servicos,
  metodoPagamento,
  gerarCodigoGuia
}) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo da Venda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Informações do Cliente</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p className="font-semibold">{cliente.nome}</p>
              <p className="text-sm text-gray-600">CPF: {cliente.cpf}</p>
              <p className="text-sm text-gray-600">{cliente.telefone}</p>
              {cliente.email && (
                <p className="text-sm text-gray-600">{cliente.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Informações da Venda</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm">
                <span className="font-medium">Data:</span> {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              <p className="text-sm">
                <span className="font-medium">Método:</span> {metodoPagamento}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total:</span> {formatarMoeda(venda.valor_total)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span> <span className="text-green-600 font-semibold">Concluída</span>
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Serviços Contratados</h4>
          <div className="space-y-2">
            {servicos.map((servico: any, index: number) => (
              <div key={servico.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{servico.servicos?.nome}</p>
                  <p className="text-sm text-gray-600">
                    Prestador: {servico.prestadores?.nome || "A definir"}
                  </p>
                  <p className="text-sm text-gray-600">Código da Guia: {gerarCodigoGuia(venda.id, index)}</p>
                </div>
                <span className="font-semibold text-green-600">
                  {formatarMoeda(servico.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendaResumo;
