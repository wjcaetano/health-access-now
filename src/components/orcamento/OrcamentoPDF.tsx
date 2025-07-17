
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Cliente, Orcamento } from '@/types';
import { format } from 'date-fns';

interface OrcamentoPDFProps {
  orcamento: Orcamento;
  cliente: Cliente;
}

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor / 100);
};

const OrcamentoPDF: React.FC<OrcamentoPDFProps> = ({ orcamento, cliente }) => {
  return (
    <Card className="w-full max-w-xl border print:shadow-none">
      <CardHeader className="bg-agendaja-primary text-white text-center py-4">
        <div className="font-bold text-2xl">AGENDA<span className="text-white">JA</span></div>
        <CardTitle className="text-xl font-medium mt-2">Orçamento</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Cliente:</p>
            <p className="font-medium">{cliente.nome}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Data:</p>
            <p>{format(orcamento.createdAt, "dd/MM/yyyy")}</p>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-lg mb-3">Detalhes do Orçamento</h3>
          <table className="w-full">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-2 text-left">Serviço</th>
                <th className="py-2 text-left">Prestador</th>
                <th className="py-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-3">{orcamento.servico}</td>
                <td className="py-3">{orcamento.clinica}</td>
                <td className="py-3 text-right font-medium">{formatarValor(orcamento.valorVenda)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Valor do Serviço:</p>
            <p>{formatarValor(orcamento.valorVenda)}</p>
          </div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Desconto ({orcamento.percentualDesconto}%):</p>
            <p className="text-green-600">- {formatarValor(orcamento.valorVenda - orcamento.valorFinal)}</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center font-bold text-lg">
            <p>Total:</p>
            <p className="text-agendaja-primary">{formatarValor(orcamento.valorFinal)}</p>
          </div>
        </div>
        
        <div className="text-center text-sm">
          <p className="font-medium">Validade: {format(orcamento.dataValidade, "dd/MM/yyyy")}</p>
          <p className="text-gray-500 mt-1">Este orçamento é válido por 2 dias a partir da data de emissão.</p>
        </div>
        
        <div className="border-t pt-4 mt-6">
          <p className="text-center text-sm text-gray-500">
            AGENDAJA - Facilitando seu acesso à saúde
            <br />
            Contato: (11) 1234-5678 | contato@agendaja.com
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrcamentoPDF;
