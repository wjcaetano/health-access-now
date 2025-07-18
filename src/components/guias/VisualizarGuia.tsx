
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Printer, Download, Package, Info } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { formatarDadosPedido } from "@/utils/pedidoUtils";

type GuiaCompleta = Tables<"guias"> & {
  clientes?: Tables<"clientes">;
  servicos?: Tables<"servicos">;
  prestadores?: Tables<"prestadores">;
  vendas_servicos?: Array<{
    venda_id: string;
    vendas: {
      id: string;
      created_at: string;
      valor_total: number;
      metodo_pagamento: string;
    };
  }>;
  data_expiracao?: string;
};

interface VisualizarGuiaProps {
  guia: GuiaCompleta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisualizarGuia: React.FC<VisualizarGuiaProps> = ({ guia, open, onOpenChange }) => {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    emitida: { label: "Emitida", color: "bg-yellow-100 text-yellow-800" },
    realizada: { label: "Realizada", color: "bg-blue-100 text-blue-800" },
    faturada: { label: "Faturada", color: "bg-green-100 text-green-800" },
    paga: { label: "Paga", color: "bg-gray-100 text-gray-800" },
    cancelada: { label: "Cancelada", color: "bg-red-100 text-red-800" },
    estornada: { label: "Estornada", color: "bg-purple-100 text-purple-800" },
    expirada: { label: "Expirada", color: "bg-orange-100 text-orange-800" }
  };

  const vendaInfo = guia.vendas_servicos?.[0];
  const dadosPedido = formatarDadosPedido(vendaInfo);

  const imprimirGuia = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Guia de Atendimento - {guia.codigo_autenticacao}</span>
            <Badge className={statusMap[guia.status]?.color}>
              {statusMap[guia.status]?.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações do Pedido - Melhoradas */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Informações do Pedido
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Número do Pedido:</span>
                <span className="ml-2 font-mono bg-blue-100 px-3 py-1 rounded text-blue-800 font-bold">
                  {dadosPedido.numeroPedido}
                </span>
              </div>
              <div>
                <span className="font-medium">Status da Venda:</span>
                <span className="ml-2 px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
                  Concluída
                </span>
              </div>
              {dadosPedido.dataVenda && (
                <div>
                  <span className="font-medium">Data da Venda:</span>
                  <span className="ml-2">
                    {format(new Date(dadosPedido.dataVenda), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium">Método de Pagamento:</span> 
                <span className="ml-2 capitalize font-medium">{dadosPedido.metodoPagamento}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Valor Total do Pedido:</span>
                <span className="ml-2 text-xl font-bold text-blue-700">
                  {formatarValor(dadosPedido.valorTotal)}
                </span>
              </div>
            </div>
            
            {/* Alerta sobre o cancelamento de pedido */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Importante sobre cancelamentos:</p>
                  <p className="mt-1">
                    Ao cancelar esta guia, <strong>TODAS as guias do pedido {dadosPedido.numeroPedido}</strong> serão automaticamente canceladas e a venda será estornada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados do Cliente</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Nome:</span> {guia.clientes?.nome}
                </div>
                <div>
                  <span className="font-medium">CPF:</span> {guia.clientes?.cpf}
                </div>
                <div>
                  <span className="font-medium">Telefone:</span> {guia.clientes?.telefone}
                </div>
                {guia.clientes?.email && (
                  <div>
                    <span className="font-medium">E-mail:</span> {guia.clientes.email}
                  </div>
                )}
                {guia.clientes?.id_associado && (
                  <div>
                    <span className="font-medium">ID Associado:</span> 
                    <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                      {guia.clientes.id_associado}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Prestador */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Dados do Prestador</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Nome:</span> {guia.prestadores?.nome}
                </div>
                <div>
                  <span className="font-medium">Tipo:</span> {guia.prestadores?.tipo}
                </div>
                {guia.prestadores?.especialidades && (
                  <div>
                    <span className="font-medium">Especialidades:</span> 
                    <span className="ml-2">{guia.prestadores.especialidades.join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações do Serviço */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Serviço Autorizado</h3>
            <div className="bg-green-50 p-4 rounded-lg space-y-2">
              <div>
                <span className="font-medium">Serviço:</span> {guia.servicos?.nome}
              </div>
              <div>
                <span className="font-medium">Categoria:</span> {guia.servicos?.categoria}
              </div>
              <div>
                <span className="font-medium">Valor Autorizado:</span> 
                <span className="ml-2 text-lg font-bold text-green-700">
                  {formatarValor(guia.valor)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações da Guia */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Informações da Guia</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Código de Autenticação:</span> 
                  <span className="ml-2 font-mono bg-blue-100 px-2 py-1 rounded">
                    {guia.codigo_autenticacao}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Data de Emissão:</span> 
                  {format(new Date(guia.data_emissao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <Badge className={`ml-2 ${statusMap[guia.status]?.color}`}>
                    {statusMap[guia.status]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Datas do Processo</h3>
              <div className="space-y-2 text-sm">
                {guia.data_realizacao && (
                  <div>
                    <span className="font-medium">Realizada em:</span> 
                    {format(new Date(guia.data_realizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
                {guia.data_faturamento && (
                  <div>
                    <span className="font-medium">Faturada em:</span> 
                    {format(new Date(guia.data_faturamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
                {guia.data_pagamento && (
                  <div>
                    <span className="font-medium">Paga em:</span> 
                    {format(new Date(guia.data_pagamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
                {guia.data_cancelamento && (
                  <div>
                    <span className="font-medium">Cancelada em:</span> 
                    {format(new Date(guia.data_cancelamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
                {guia.data_estorno && (
                  <div>
                    <span className="font-medium">Estornada em:</span> 
                    {format(new Date(guia.data_estorno), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-4 pt-4 border-t">
            <Button onClick={imprimirGuia} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir Guia
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarGuia;
