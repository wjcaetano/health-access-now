
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, DollarSign, Building, MapPin, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RoyaltyDetailsProps {
  royalty: {
    id: string;
    franquia: {
      nome_fantasia: string;
      razao_social: string;
      cnpj: string;
      cidade: string;
      estado: string;
      endereco_completo: string;
    };
    mes_referencia: number;
    ano_referencia: number;
    faturamento_bruto: number;
    valor_royalty: number;
    valor_marketing: number;
    valor_total: number;
    data_vencimento: string;
    data_pagamento?: string;
    status: string;
    observacoes?: string;
    created_at: string;
  } | null;
  open: boolean;
  onClose: () => void;
  onConfirmPayment: (id: string) => void;
  onSendReminder: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1);
  return format(date, 'MMMM \'de\' yyyy', { locale: ptBR });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pago':
      return <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Pago
      </Badge>;
    case 'atrasado':
      return <Badge variant="destructive">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Atrasado
      </Badge>;
    case 'pendente':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>;
    case 'isento':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        Isento
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const RoyaltyDetails: React.FC<RoyaltyDetailsProps> = ({
  royalty,
  open,
  onClose,
  onConfirmPayment,
  onSendReminder
}) => {
  if (!royalty) return null;

  const isOverdue = new Date(royalty.data_vencimento) < new Date() && royalty.status === 'pendente';
  const canConfirmPayment = royalty.status === 'pendente' || isOverdue;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes do Royalty
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Período */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {formatMonth(royalty.mes_referencia, royalty.ano_referencia)}
              </h3>
              <p className="text-sm text-muted-foreground">
                Gerado em {format(new Date(royalty.created_at), 'dd/MM/yyyy')}
              </p>
            </div>
            {getStatusBadge(royalty.status)}
          </div>

          {/* Informações da Franquia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4" />
                Franquia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{royalty.franquia.nome_fantasia}</p>
                <p className="text-sm text-muted-foreground">{royalty.franquia.razao_social}</p>
                <p className="text-sm text-muted-foreground">CNPJ: {royalty.franquia.cnpj}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">{royalty.franquia.cidade}/{royalty.franquia.estado}</p>
                  <p className="text-sm text-muted-foreground">{royalty.franquia.endereco_completo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Faturamento Bruto</p>
                  <p className="text-lg font-semibold">{formatCurrency(royalty.faturamento_bruto)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Royalty</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(royalty.valor_royalty)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Taxa de Marketing</p>
                  <p className="text-lg font-semibold text-purple-600">{formatCurrency(royalty.valor_marketing)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total a Pagar</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(royalty.valor_total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4" />
                Datas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Data de Vencimento:</span>
                <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                  {format(new Date(royalty.data_vencimento), 'dd/MM/yyyy')}
                  {isOverdue && <span className="ml-2 text-red-600">(Vencido)</span>}
                </span>
              </div>
              
              {royalty.data_pagamento && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Data de Pagamento:</span>
                  <span className="font-medium text-green-600">
                    {format(new Date(royalty.data_pagamento), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observações */}
          {royalty.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{royalty.observacoes}</p>
              </CardContent>
            </Card>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            {canConfirmPayment && (
              <Button
                onClick={() => onConfirmPayment(royalty.id)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmar Pagamento
              </Button>
            )}
            
            {(royalty.status === 'pendente' || isOverdue) && (
              <Button
                variant="outline"
                onClick={() => onSendReminder(royalty.id)}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Enviar Lembrete
              </Button>
            )}
            
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
