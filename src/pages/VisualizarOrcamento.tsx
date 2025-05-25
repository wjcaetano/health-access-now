
import React, { useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Calendar,
  User,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react";
import { Orcamento } from "@/types";
import { format } from "date-fns";
import { orcamentos } from "@/data/mock";
import { useToast } from "@/hooks/use-toast";

const statusMap = {
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  aprovado: {
    label: "Aprovado",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  recusado: {
    label: "Recusado",
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
  }).format(valor / 100);
};

const VisualizarOrcamento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Encontrar o orçamento pelo ID
  const orcamento = orcamentos.find(o => o.id === id);
  
  if (!orcamento) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Orçamento não encontrado</p>
      </div>
    );
  }

  const handleStatusChange = (novoStatus: Orcamento['status']) => {
    // Aqui você implementaria a lógica para atualizar o status no backend
    toast({
      title: "Status atualizado",
      description: `Orçamento ${statusMap[novoStatus].label.toLowerCase()} com sucesso.`,
    });
    
    // Simular atualização local (em produção seria via API)
    console.log(`Atualizando orçamento ${id} para status: ${novoStatus}`);
  };

  const isExpired = new Date() > orcamento.dataValidade;
  const canApprove = orcamento.status === 'pendente' && !isExpired;
  const canReject = orcamento.status === 'pendente' && !isExpired;

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
              <p className="font-semibold">{orcamento.cliente?.nome}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">CPF</label>
              <p>{orcamento.cliente?.cpf}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Telefone</label>
              <p>{orcamento.cliente?.telefone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p>{orcamento.cliente?.email}</p>
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
              <p className="font-semibold">{orcamento.servico}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Prestador</label>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {orcamento.clinica}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Original</label>
              <p className="text-lg font-bold text-gray-400 line-through">
                {formatarValor(orcamento.valorVenda)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Desconto</label>
              <p className="text-green-600 font-semibold">{orcamento.percentualDesconto}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Valor Final</label>
              <p className="text-2xl font-bold text-agendaja-primary">
                {formatarValor(orcamento.valorFinal)}
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
                <Badge variant="outline" className={statusMap[orcamento.status].color}>
                  {statusMap[orcamento.status].label}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data do Orçamento</label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(orcamento.createdAt, "dd/MM/yyyy 'às' HH:mm")}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Data de Validade</label>
              <p className={`flex items-center gap-2 ${isExpired ? 'text-red-600' : ''}`}>
                <Calendar className="h-4 w-4 text-gray-400" />
                {format(orcamento.dataValidade, "dd/MM/yyyy")}
                {isExpired && <span className="text-xs">(Expirado)</span>}
              </p>
            </div>

            <div className="pt-4 space-y-2">
              {canApprove && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" variant="default">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprovar Orçamento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Aprovação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja aprovar este orçamento? Esta ação irá confirmar a venda.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusChange('aprovado')}>
                        Sim, Aprovar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {canReject && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Recusar Orçamento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Recusa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja recusar este orçamento? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusChange('recusado')}>
                        Sim, Recusar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {orcamento.status === 'aprovado' && (
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate('/checkout-vendas')}
                >
                  Ir para Checkout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisualizarOrcamento;
