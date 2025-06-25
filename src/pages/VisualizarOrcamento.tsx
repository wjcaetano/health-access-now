
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, MapPin, Phone, Mail, FileText } from "lucide-react";
import { useOrcamento } from "@/hooks/useOrcamentos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AcoesOrcamento from "@/components/orcamentos/AcoesOrcamento";
import { useCreateVenda } from "@/hooks/useVendas";
import { useCancelarOrcamento } from "@/hooks/useOrcamentos";
import { useToast } from "@/hooks/use-toast";

const VisualizarOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: orcamento, isLoading } = useOrcamento(id!);
  const { mutate: criarVenda, isPending: isCreatingVenda } = useCreateVenda();
  const { mutate: cancelarOrcamento, isPending: isCancelingOrcamento } = useCancelarOrcamento();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Carregando orçamento...</p>
        </div>
      </div>
    );
  }

  if (!orcamento) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500">Orçamento não encontrado</p>
          <Button onClick={() => navigate('/orcamentos')} className="mt-4">
            Voltar para Orçamentos
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date() > new Date(orcamento.data_validade);
  const isPendente = orcamento.status === 'pendente' && !isExpired;

  const getStatusColor = () => {
    if (orcamento.status === 'aprovado') return "bg-green-100 text-green-800";
    if (orcamento.status === 'cancelado') return "bg-red-100 text-red-800";
    if (isExpired) return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusLabel = () => {
    if (orcamento.status === 'aprovado') return "Aprovado";
    if (orcamento.status === 'cancelado') return "Cancelado";
    if (isExpired) return "Expirado";
    return "Pendente";
  };

  const handleConcluirVenda = () => {
    if (!orcamento.clientes || !orcamento.servicos) {
      toast({
        title: "Erro",
        description: "Dados do orçamento incompletos.",
        variant: "destructive"
      });
      return;
    }

    // Redirecionar para o checkout com os dados do orçamento
    navigate('/checkout-vendas', {
      state: {
        vendaData: {
          cliente: orcamento.clientes,
          servicos: [{
            id: orcamento.servico_id,
            nome: orcamento.servicos.nome,
            categoria: orcamento.servicos.categoria,
            prestadorId: orcamento.prestador_id,
            prestadorNome: orcamento.prestadores?.nome || "Prestador",
            valorVenda: orcamento.valor_final,
            descricao: orcamento.observacoes
          }],
          orcamentoId: orcamento.id
        }
      }
    });
  };

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/orcamentos')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Visualizar Orçamento</h2>
        </div>
        <Badge variant="outline" className={getStatusColor()}>
          {getStatusLabel()}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Orçamento */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Dados do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">{orcamento.clientes?.nome}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">CPF:</span>
                    <span>{orcamento.clientes?.cpf}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">Telefone:</span>
                    <span>{orcamento.clientes?.telefone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <span className="font-medium mr-2">E-mail:</span>
                    <span>{orcamento.clientes?.email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalhes do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">{orcamento.servicos?.nome}</h4>
                <p className="text-blue-600 mb-2">Categoria: {orcamento.servicos?.categoria}</p>
                <p className="text-blue-600">Prestador: {orcamento.prestadores?.nome}</p>
              </div>
              
              {orcamento.observacoes && (
                <div>
                  <h5 className="font-medium mb-2">Observações:</h5>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded">{orcamento.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Resumo e Ações */}
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor de Custo:</span>
                <span className="font-medium">R$ {orcamento.valor_custo.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Valor de Venda:</span>
                <span className="font-medium">R$ {orcamento.valor_venda.toFixed(2)}</span>
              </div>
              
              {orcamento.percentual_desconto > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto ({orcamento.percentual_desconto}%):</span>
                  <span>- R$ {((orcamento.valor_venda * orcamento.percentual_desconto) / 100).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Valor Final:</span>
                  <span className="text-green-600">R$ {orcamento.valor_final.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações de Data */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-sm">Criado em:</p>
                  <p className="font-medium">
                    {format(new Date(orcamento.created_at || ''), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <div>
                  <p className="text-sm">Válido até:</p>
                  <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                    {format(new Date(orcamento.data_validade), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent>
              <AcoesOrcamento
                orcamento={orcamento}
                onCancelar={handleCancelar}
                onConcluirVenda={handleConcluirVenda}
                isLoading={isCreatingVenda || isCancelingOrcamento}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisualizarOrcamento;
