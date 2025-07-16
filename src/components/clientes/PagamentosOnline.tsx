
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Clock, CheckCircle, AlertCircle, Download, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PagamentosOnlineProps {
  clienteId: string;
}

const PagamentosOnline: React.FC<PagamentosOnlineProps> = ({ clienteId }) => {
  const [metodoPagamento, setMetodoPagamento] = useState<string | null>(null);

  // Mock data - em implementação real, buscar do banco
  const contasPendentes = [
    {
      id: "1",
      servico: "Consulta Cardiológica",
      data: new Date(2024, 0, 25),
      vencimento: new Date(2024, 1, 5),
      valor: 220.00,
      status: "pendente"
    },
    {
      id: "2",
      servico: "Exames Laboratoriais",
      data: new Date(2024, 0, 22),
      vencimento: new Date(2024, 1, 2),
      valor: 150.00,
      status: "vencida"
    }
  ];

  const historicoePagamentos = [
    {
      id: "1",
      servico: "Eletrocardiograma",
      data: new Date(2024, 0, 10),
      valor: 180.50,
      metodoPagamento: "Cartão de Crédito",
      status: "pago"
    },
    {
      id: "2",
      servico: "Holter 24h",
      data: new Date(2023, 11, 20),
      valor: 350.00,
      metodoPagamento: "PIX",
      status: "pago"
    }
  ];

  const cartoesDisponiveis = [
    {
      id: "1",
      final: "1234",
      bandeira: "Visa",
      titular: "MARIA DA SILVA"
    },
    {
      id: "2",
      final: "5678",
      bandeira: "Mastercard",
      titular: "MARIA DA SILVA"
    }
  ];

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calcularTotal = (contas: any[]) => {
    return contas.reduce((sum, conta) => sum + conta.valor, 0);
  };

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatMoeda(calcularTotal(contasPendentes.filter(c => c.status === 'pendente')))}
                </p>
                <p className="text-sm text-gray-500">
                  {contasPendentes.filter(c => c.status === 'pendente').length} conta(s)
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatMoeda(calcularTotal(contasPendentes.filter(c => c.status === 'vencida')))}
                </p>
                <p className="text-sm text-gray-500">
                  {contasPendentes.filter(c => c.status === 'vencida').length} conta(s)
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagas Este Ano</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatMoeda(calcularTotal(historicoePagamentos))}
                </p>
                <p className="text-sm text-gray-500">
                  {historicoePagamentos.length} pagamento(s)
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes">
            Pendentes ({contasPendentes.length})
          </TabsTrigger>
          <TabsTrigger value="historico">
            Histórico ({historicoePagamentos.length})
          </TabsTrigger>
          <TabsTrigger value="cartoes">
            Cartões ({cartoesDisponiveis.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="mt-6">
          <div className="space-y-4">
            {contasPendentes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <p className="text-gray-500">Não há contas pendentes</p>
                </CardContent>
              </Card>
            ) : (
              contasPendentes.map((conta) => (
                <Card key={conta.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{conta.servico}</h3>
                        <p className="text-sm text-gray-600">
                          Realizado em {format(conta.data, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Vencimento: {format(conta.vencimento, "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(conta.status)}>
                          {conta.status}
                        </Badge>
                        <div className="text-lg font-semibold mt-2">
                          {formatMoeda(conta.valor)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pagar Agora
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="historico" className="mt-6">
          <div className="space-y-4">
            {historicoePagamentos.map((pagamento) => (
              <Card key={pagamento.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{pagamento.servico}</h3>
                      <p className="text-sm text-gray-600">
                        Pago em {format(pagamento.data, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Método: {pagamento.metodoPagamento}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(pagamento.status)}>
                        {pagamento.status}
                      </Badge>
                      <div className="text-lg font-semibold mt-2">
                        {formatMoeda(pagamento.valor)}
                      </div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-4 w-4 mr-2" />
                        Comprovante
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cartoes" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Meus Cartões
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cartão
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartoesDisponiveis.map((cartao) => (
                    <div 
                      key={cartao.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {cartao.bandeira} •••• {cartao.final}
                            </div>
                            <div className="text-sm text-gray-500">
                              {cartao.titular}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PagamentosOnline;
