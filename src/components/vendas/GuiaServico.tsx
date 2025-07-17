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

  const codigoPedido = venda.id.slice(0, 8).toUpperCase();

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto mb-8 page-break-after border-2 border-gray-400 print:max-w-none">
      {/* Cabeçalho da Guia */}
      <div className="text-center mb-8 border-b-2 border-gray-400 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GUIA DE AUTORIZAÇÃO DE SERVIÇO</h1>
        <div className="bg-blue-100 border-2 border-blue-400 p-4 rounded-lg inline-block">
          <p className="text-2xl font-bold text-blue-800">Nº AUTENTICAÇÃO: {codigoGuia}</p>
        </div>
        <div className="bg-green-100 border-2 border-green-400 p-3 rounded-lg inline-block mt-4">
          <p className="text-lg font-bold text-green-800">PEDIDO: {codigoPedido}</p>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>AGENDAJÁ SAÚDE</strong> - Plataforma de Agendamento de Serviços de Saúde</p>
          <p>Esta guia autoriza a execução do serviço descrito abaixo</p>
        </div>
      </div>

      {/* Informações do Pedido */}
      <div className="border-2 border-green-400 bg-green-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-green-800 mb-4 bg-green-200 p-2 rounded">
          INFORMAÇÕES DO PEDIDO
        </h3>
        <div className="grid grid-cols-2 gap-6 text-base">
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-green-800">Código do Pedido:</span>
              <div className="bg-white p-2 rounded border border-green-300 mt-1">
                <p className="font-mono text-lg font-bold text-green-900">{codigoPedido}</p>
              </div>
            </div>
            <div>
              <span className="font-semibold text-green-800">Data do Pedido:</span>
              <div className="bg-white p-2 rounded border border-green-300 mt-1">
                <p className="text-green-900">
                  {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-green-800">Valor Total do Pedido:</span>
              <div className="bg-white p-2 rounded border border-green-300 mt-1">
                <p className="text-xl font-bold text-green-900">{formatarMoeda(venda.valor_total)}</p>
              </div>
            </div>
            <div>
              <span className="font-semibold text-green-800">Método de Pagamento:</span>
              <div className="bg-white p-2 rounded border border-green-300 mt-1">
                <p className="text-green-900 capitalize">{venda.metodo_pagamento}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dados do Paciente */}
      <div className="border-2 border-gray-300 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">
          DADOS DO PACIENTE
        </h3>
        <div className="space-y-3 text-base">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Nome:</span>
            <span className="font-medium">{cliente.nome}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">CPF:</span>
            <span>{cliente.cpf}</span>
          </div>
          {cliente.telefone && (
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Telefone:</span>
              <span>{cliente.telefone}</span>
            </div>
          )}
          {cliente.email && (
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">E-mail:</span>
              <span>{cliente.email}</span>
            </div>
          )}
          {cliente.id_associado && (
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">ID Associado:</span>
              <span className="font-mono bg-gray-100 p-1 rounded">{cliente.id_associado}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dados da Unidade Emissora */}
      <div className="border-2 border-gray-300 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">
          UNIDADE EMISSORA
        </h3>
        <div className="space-y-3 text-base">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Razão Social:</span>
            <span className="font-medium">AGENDAJÁ SAÚDE LTDA</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">CNPJ:</span>
            <span>12.345.678/0001-90</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Endereço:</span>
            <span>Rua das Flores, 123 - Centro</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">Telefone:</span>
            <span>(11) 3000-0000</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-semibold">E-mail:</span>
            <span>contato@agendaja.com.br</span>
          </div>
        </div>
      </div>

      {/* Serviço Autorizado */}
      <div className="border-2 border-green-400 bg-green-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-green-800 mb-4 bg-green-200 p-2 rounded">
          SERVIÇO AUTORIZADO
        </h3>
        <div className="space-y-4 text-base">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <span className="font-semibold text-green-800">Descrição do Serviço:</span>
              <div className="bg-white p-3 rounded border border-green-300 mt-1">
                <p className="text-lg font-bold text-green-900">{servico.servicos?.nome}</p>
                <p className="text-green-700">Categoria: {servico.servicos?.categoria}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-green-800">Valor Autorizado:</span>
                <div className="bg-white p-2 rounded border border-green-300 mt-1">
                  <p className="text-xl font-bold text-green-900">{formatarMoeda(servico.valor)}</p>
                </div>
              </div>
              <div>
                <span className="font-semibold text-green-800">Código do Serviço:</span>
                <div className="bg-white p-2 rounded border border-green-300 mt-1">
                  <p className="font-mono text-green-900">{servico.servico_id?.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dados do Prestador */}
      <div className="border-2 border-blue-400 bg-blue-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-blue-800 mb-4 bg-blue-200 p-2 rounded">
          PRESTADOR AUTORIZADO
        </h3>
        <div className="space-y-3 text-base">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-blue-800">Nome/Razão Social:</span>
              <div className="bg-white p-2 rounded border border-blue-300 mt-1">
                <p className="font-bold text-blue-900">{servico.prestadores?.nome || "A definir"}</p>
              </div>
            </div>
            <div>
              <span className="font-semibold text-blue-800">Especialidade:</span>
              <div className="bg-white p-2 rounded border border-blue-300 mt-1">
                <p className="text-blue-900">{servico.prestadores?.especialidades?.[0] || "Geral"}</p>
              </div>
            </div>
          </div>
          <div>
            <span className="font-semibold text-blue-800">Código do Prestador:</span>
            <div className="bg-white p-2 rounded border border-blue-300 mt-1">
              <p className="font-mono text-blue-900">{servico.prestador_id?.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informações da Autorização */}
      <div className="border-2 border-gray-400 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-200 p-2 rounded">
          INFORMAÇÕES DA AUTORIZAÇÃO
        </h3>
        <div className="grid grid-cols-2 gap-6 text-base">
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Data de Emissão:</span>
              <p className="bg-gray-100 p-2 rounded mt-1">
                {format(new Date(venda.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div>
              <span className="font-semibold">Status da Autorização:</span>
              <p className="bg-green-100 text-green-800 font-bold p-2 rounded mt-1">AUTORIZADA</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Número da Venda:</span>
              <p className="bg-gray-100 p-2 rounded mt-1 font-mono">
                {venda.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div>
              <span className="font-semibold">Valor Total da Venda:</span>
              <p className="bg-gray-100 p-2 rounded mt-1 font-bold">
                {formatarMoeda(venda.valor_total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções para o Prestador */}
      <div className="border-2 border-orange-400 bg-orange-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-orange-800 mb-4 bg-orange-200 p-2 rounded">
          INSTRUÇÕES PARA O PRESTADOR
        </h3>
        <ul className="text-sm text-orange-800 space-y-2 list-disc list-inside">
          <li><strong>Esta guia deve ser apresentada pelo paciente no momento do atendimento</strong></li>
          <li><strong>Verifique a autenticidade através do código de autenticação informado</strong></li>
          <li><strong>O serviço só deve ser executado mediante apresentação desta guia</strong></li>
          <li><strong>Após a execução do serviço, confirme através do sistema usando o código de autenticação</strong></li>
          <li><strong>O faturamento só será processado após confirmação da execução do serviço</strong></li>
          <li><strong>Mantenha esta guia em seus arquivos para auditoria</strong></li>
          <li><strong>Em caso de dúvidas, entre em contato através dos canais oficiais</strong></li>
        </ul>
      </div>

      {/* Seção para Confirmação de Execução */}
      <div className="border-2 border-gray-600 p-6 rounded-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-300 p-2 rounded">
          CONFIRMAÇÃO DE EXECUÇÃO DO SERVIÇO
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="border-t-2 border-gray-600 w-48 mx-auto mb-2 mt-12"></div>
            <p className="font-semibold">Assinatura do Prestador</p>
          </div>
          <div>
            <div className="border-t-2 border-gray-600 w-48 mx-auto mb-2 mt-12"></div>
            <p className="font-semibold">Data de Execução</p>
          </div>
          <div>
            <div className="border-t-2 border-gray-600 w-48 mx-auto mb-2 mt-12"></div>
            <p className="font-semibold">Carimbo do Prestador</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="text-center mt-8 pt-6 border-t-2 border-gray-400">
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>AGENDAJÁ SAÚDE - Plataforma de Agendamento de Serviços</strong></p>
          <p>www.agendaja.com.br | Suporte: (11) 3000-0000 | contato@agendaja.com.br</p>
          <p className="mt-2 font-semibold">
            Guia emitida em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Esta guia é válida apenas para o serviço especificado e deve ser apresentada no momento do atendimento
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuiaServico;
