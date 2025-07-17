
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReciboVendaProps {
  venda: any;
  cliente: any;
  servicos: any[];
  metodoPagamento: string;
}

const ReciboVenda: React.FC<ReciboVendaProps> = ({
  venda,
  cliente,
  servicos,
  metodoPagamento
}) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="bg-white p-8 max-w-md mx-auto print:max-w-none">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">RECIBO DE PAGAMENTO</h1>
        <div className="border-t-2 border-gray-300 pt-2">
          <p className="text-sm text-gray-600">Nº {venda.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* Dados da Empresa */}
        <div className="border-b pb-3">
          <h3 className="font-semibold text-gray-900">AGENDAJÁ SAÚDE</h3>
          <p className="text-sm text-gray-600">Plataforma de Agendamento de Serviços de Saúde</p>
        </div>

        {/* Dados do Cliente */}
        <div>
          <h4 className="font-medium text-gray-700 mb-1">DADOS DO CLIENTE:</h4>
          <p className="text-sm"><strong>Nome:</strong> {cliente.nome}</p>
          <p className="text-sm"><strong>CPF:</strong> {cliente.cpf}</p>
          {cliente.telefone && <p className="text-sm"><strong>Telefone:</strong> {cliente.telefone}</p>}
          {cliente.id_associado && <p className="text-sm"><strong>ID Associado:</strong> {cliente.id_associado}</p>}
        </div>

        {/* Serviços */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">SERVIÇOS CONTRATADOS:</h4>
          <div className="space-y-1">
            {servicos.map((servico, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{servico.servicos?.nome}</span>
                <span>{formatarMoeda(servico.valor)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-2">
          <div className="flex justify-between font-bold">
            <span>TOTAL PAGO:</span>
            <span>{formatarMoeda(venda.valor_total)}</span>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div>
          <p className="text-sm"><strong>Forma de Pagamento:</strong> {metodoPagamento}</p>
          <p className="text-sm"><strong>Data do Pagamento:</strong> {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p className="text-sm"><strong>Status:</strong> <span className="text-green-600 font-semibold">PAGO</span></p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 border-t pt-3">
        <p>Este recibo comprova o pagamento dos serviços relacionados.</p>
        <p>Para dúvidas, entre em contato conosco.</p>
        <p className="mt-2">Recibo emitido em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
};

export default ReciboVenda;
