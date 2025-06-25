
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  User,
  Clock,
  MapPin,
  FileText,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useOrcamento, useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useCreateVenda } from "@/hooks/useVendas";
import AcoesOrcamento from "@/components/orcamentos/AcoesOrcamento";

const statusMap = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  },
  expirado: {
    label: "Expirado",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  }
};

const formatarValor = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};

const VisualizarOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: orcamento, isLoading, error } = useOrcamento(id || '');
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando orçamento...</p>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Orçamento não encontrado</p>
      </div>
    );
  }

  const isExpired = new Date() > new Date(orcamento.data_validade);
  const currentStatus = isExpired && orcamento.status === 'pendente' ? 'expirado' : orcamento.status;

  const handleCancelar = (orcamentoId: string) => {
    cancelarOrcamento(orcamentoId, {
      onSuccess: () => {
        toast({
          title: "Orçamento cancelado",
          description: "O orçamento foi cancelado com sucesso."
        });
        navigate('/orcamentos');
      },
      onError: (error) => {
        toast({
          title: "Erro ao cancelar",
          description: "Ocorreu um erro ao cancelar o orçamento.",
          variant: "destructive"
        });
        console.error('Erro ao cancelar orçamento:', error);
      }
    });
  };

  const handleConcluirVenda = (orcamento: any) => {
    const novaVenda = {
      cliente_id: orcamento.cliente_id,
      valor_total: orcamento.valor_final,
      metodo_pagamento: 'pix',
      status: 'concluida'
    };

    const servicosVenda = [{
      servico_id: orcamento.servico_id,
      prestador_id: orcamento.prestador_id,
      valor: orcamento.valor_final
    }];

    criarVenda({ venda: novaVenda, servicos: servicosVenda }, {
      onSuccess: () => {
        toast({
          title: "Venda concluída",
          description: "A venda foi realizada com sucesso!"
        });
        navigate('/vendas');
      },
      onError: (error) => {
        toast({
          title: "Erro ao concluir venda",
          description: "Ocorreu um erro ao processar a venda.",
          variant: "destructive"
        });
        console.error('Erro ao criar venda:', error);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/orcamentos')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Visualizar Orçamento</h2>
          <p className="text-gray-500 mt-1">
            Orçamento #{orcamento.id.substring(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="font-semibold">{orcamento.clientes?.nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p>{orcamento.clientes?.cpf}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p>{orcamento.clientes?.telefone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p>{orcamento.clientes?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Serviço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dados do Serviço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Serviço</label>
              <p className="font-semibold">{orcamento.servicos?.nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Categoria</label>
              <p>{orcamento.servicos?.categoria}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Prestador</label>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {orcamento.prestadores?.nome}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Original</label>
              <p className="text-lg font-bold text-gray-400 line-through">
                {formatarValor(orcamento.valor_venda)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Desconto</label>
              <p className="text-green-600 font-semibold">{orcamento.percentual_desconto}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Final</label>
              <p className="text-2xl font-bold text-agendaja-primary">
                {formatarValor(orcamento.valor_final)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status e Ações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Status e Ações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Status Atual</label>
              <div className="mt-1">
                <Badge variant="outline" className={statusMap[currentStatus as keyof typeof statusMap].color}>
                  {statusMap[currentStatus as keyof typeof statusMap].label}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Orçamento</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(new Date(orcamento.created_at || ''), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Validade</label>
              <p className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : ''}`}>
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                {isExpired && <span className="text-xs">(Expirado)</span>}
              </p>
            </div>

            <div className="pt-4">
              <AcoesOrcamento
                orcamento={orcamento}
                onCancelar={handleCancelar}
                onConcluirVenda={handleConcluirVenda}
                isLoading={isCancelingOrcamento || isCreatingVenda}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisualizarOrcamento;
