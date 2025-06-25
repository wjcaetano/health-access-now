
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GuiaServicoProps {
  venda: any;
  cliente: any;
  servico: any;
  codigoGuia: string;
}

const GuiaServico: React.FC<GuiaServicoProps> = ({
  venda,
  cliente,
  servico,
  codigoGuia
}) => {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <div className="bg-white p-6 max-w-lg mx-auto mb-8 page-break-after border border-gray-300">
      {/* Cabeçalho */}
      <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-1">GUIA DE SERVIÇO</h1>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-lg font-bold text-blue-600">CÓDIGO: {codigoGuia}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          AGENDAJÁ SAÚDE - Plataforma de Agendamento de Serviços
        </p>
      </div>

      {/* Dados do Cliente */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          DADOS DO PACIENTE:
        </h3>
        <div className="grid grid-cols-1 gap-1 text-sm">
          <p><strong>Nome:</strong> {cliente.nome}</p>
          <p><strong>CPF:</strong> {cliente.cpf}</p>
          <p><strong>Telefone:</strong> {cliente.telefone}</p>
          {cliente.email && <p><strong>E-mail:</strong> {cliente.email}</p>}
          {cliente.id_associado && <p><strong>ID Associado:</strong> {cliente.id_associado}</p>}
        </div>
      </div>

      {/* Dados do Serviço */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          SERVIÇO AUTORIZADO:
        </h3>
        <div className="bg-blue-50 p-3 rounded">
          <p className="font-semibold text-blue-800">{servico.servicos?.nome}</p>
          <p className="text-sm text-blue-600">Categoria: {servico.servicos?.categoria}</p>
          <p className="text-sm">Valor Autorizado: {formatarMoeda(servico.valor)}</p>
          <p className="text-xs text-gray-600 mt-1">
            Código do Serviço: {servico.servico_id?.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Dados do Prestador */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          PRESTADOR DE SERVIÇO:
        </h3>
        <div className="bg-green-50 p-3 rounded">
          <p className="font-semibold text-green-800">{servico.prestadores?.nome || "A definir"}</p>
          <p className="text-sm text-green-600">
            Especialidade: {servico.prestadores?.especialidades?.[0] || "Geral"}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Código do Prestador: {servico.prestador_id?.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Informações da Venda */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          INFORMAÇÕES DA COMPRA:
        </h3>
        <div className="text-sm space-y-1">
          <p><strong>Data da Compra:</strong> {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p><strong>Status:</strong> <span className="text-green-600 font-semibold">PAGO</span></p>
          <p><strong>Venda Nº:</strong> {venda.id.slice(0, 8).toUpperCase()}</p>
          <p><strong>Valor Total da Venda:</strong> {formatarMoeda(venda.valor_total)}</p>
        </div>
      </div>

      {/* Instruções */}
      <div className="border-t-2 border-gray-300 pt-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-2">INSTRUÇÕES IMPORTANTES:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Esta guia deve ser apresentada ao prestador no momento do atendimento</li>
          <li>• Válida apenas para o serviço especificado acima</li>
          <li>• Em caso de dúvidas, entre em contato através do código da guia</li>
          <li>• Mantenha esta guia até a conclusão do serviço</li>
          <li>• O prestador deve confirmar a realização do serviço nesta guia</li>
        </ul>
      </div>

      {/* Assinatura */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="border-t border-gray-400 w-32 mx-auto mb-1"></div>
            <p>Assinatura do Prestador</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-32 mx-auto mb-1"></div>
            <p>Data do Atendimento</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="border-t border-gray-400 w-40 mx-auto mb-1"></div>
          <p className="text-xs">Carimbo do Prestador</p>
        </div>
      </div>

      {/* Rodapé */}
      <div className="text-center mt-6 text-xs text-gray-500 border-t pt-3">
        <p>AGENDAJÁ SAÚDE - Plataforma de Agendamento</p>
        <p>www.agendaja.com.br | Suporte: (11) 99999-9999</p>
        <p className="mt-1">Guia gerada em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
};

export default GuiaServico;
