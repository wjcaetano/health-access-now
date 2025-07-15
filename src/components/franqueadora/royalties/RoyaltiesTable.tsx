
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RoyaltyData {
  id: string;
  franquia_id: string;
  franquia: {
    nome_fantasia: string;
    cidade: string;
    estado: string;
  };
  mes_referencia: number;
  ano_referencia: number;
  faturamento_bruto: number;
  valor_royalty: number;
  valor_marketing: number;
  valor_total: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'isento';
  observacoes?: string;
}

interface RoyaltiesTableProps {
  royalties: RoyaltyData[];
  onPaymentConfirm: (id: string) => void;
  onSendReminder: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const getStatusBadge = (status: string, dataVencimento: string) => {
  const isOverdue = new Date(dataVencimento) < new Date() && status === 'pendente';
  
  switch (status) {
    case 'pago':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Pago
      </Badge>;
    case 'atrasado':
    case (isOverdue ? 'pendente' : ''):
      return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Atrasado
      </Badge>;
    case 'pendente':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pendente
      </Badge>;
    case 'isento':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Isento
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatMonth = (month: number, year: number) => {
  const date = new Date(year, month - 1);
  return format(date, 'MMM/yyyy', { locale: ptBR });
};

export const RoyaltiesTable: React.FC<RoyaltiesTableProps> = ({
  royalties,
  onPaymentConfirm,
  onSendReminder,
  onViewDetails
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Controle de Royalties
        </CardTitle>
        <CardDescription>
          Gestão de pagamentos e cobrança de royalties das franquias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Franquia</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Faturamento</TableHead>
                <TableHead>Royalty</TableHead>
                <TableHead>Marketing</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {royalties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    Nenhum royalty encontrado
                  </TableCell>
                </TableRow>
              ) : (
                royalties.map((royalty) => {
                  const isOverdue = new Date(royalty.data_vencimento) < new Date() && royalty.status === 'pendente';
                  
                  return (
                    <TableRow key={royalty.id} className={isOverdue ? "bg-red-50" : ""}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{royalty.franquia.nome_fantasia}</div>
                          <div className="text-sm text-muted-foreground">
                            {royalty.franquia.cidade}/{royalty.franquia.estado}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatMonth(royalty.mes_referencia, royalty.ano_referencia)}
                      </TableCell>
                      <TableCell>{formatCurrency(royalty.faturamento_bruto)}</TableCell>
                      <TableCell>{formatCurrency(royalty.valor_royalty)}</TableCell>
                      <TableCell>{formatCurrency(royalty.valor_marketing)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(royalty.valor_total)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(royalty.data_vencimento), 'dd/MM/yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(royalty.status, royalty.data_vencimento)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(royalty.id)}
                          >
                            Detalhes
                          </Button>
                          
                          {(royalty.status === 'pendente' || isOverdue) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSendReminder(royalty.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Lembrete
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPaymentConfirm(royalty.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmar
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
