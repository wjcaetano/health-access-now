
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Clock, CheckCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGuias } from "@/hooks/useGuias";

interface PainelFaturamentoProps {
  prestadorId: string;
}

const PainelFaturamento: React.FC<PainelFaturamentoProps> = ({ prestadorId }) => {
  const { data: guias, isLoading } = useGuias();

  // Filtrar guias do prestador
  const guiasPrestador = guias?.filter(g => g.prestador_id === prestadorId) || [];

  // Separar guias por status
  const guiasPendentes = guiasPrestador.filter(g => g.status === 'pendente');
  const guiasFaturadas = guiasPrestador.filter(g => g.status === 'faturada');
  const guiasPagas = guiasPrestador.filter(g => g.status === 'paga');

  // Calcular totais
  const totalPendente = guiasPendentes.reduce((sum, g) => sum + Number(g.valor), 0);
  const totalFaturado = guiasFaturadas.reduce((sum, g) => sum + Number(g.valor), 0);
  const totalRecebido = guiasPagas.reduce((sum, g) => sum + Number(g.valor), 0);

  const formatMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'faturada': return 'bg-blue-100 text-blue-800';
      case 'paga': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const GuiaCard = ({ guia }: { guia: any }) => (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-medium">{guia.clientes?.nome}</div>
          <div className="text-sm text-gray-500">
            Código: {guia.codigo_autenticacao}
          </div>
        </div>
        <Badge className={getStatusColor(guia.status)}>
          {guia.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">Serviço</div>
          <div className="font-medium">{guia.servicos?.nome}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Valor</div>
          <div className="font-medium">{formatMoeda(Number(guia.valor))}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Data Emissão</div>
          <div className="font-medium">
            {guia.data_emissao ? format(new Date(guia.data_emissao), "dd/MM/yyyy") : '-'}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Data Realização</div>
          <div className="font-medium">
            {guia.data_realizacao ? format(new Date(guia.data_realizacao), "dd/MM/yyyy") : '-'}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Ver Detalhes
        </Button>
        {guia.status === 'pendente' && (
          <Button size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Faturar
          </Button>
        )}
        <Button size="sm" variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendente Faturamento</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatMoeda(totalPendente)}
                </p>
                <p className="text-sm text-gray-500">
                  {guiasPendentes.length} guias
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
                <p className="text-sm text-gray-600">Faturado</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatMoeda(totalFaturado)}
                </p>
                <p className="text-sm text-gray-500">
                  {guiasFaturadas.length} guias
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recebido</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatMoeda(totalRecebido)}
                </p>
                <p className="text-sm text-gray-500">
                  {guiasPagas.length} guias
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Guias */}
      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes">
            Pendentes ({guiasPendentes.length})
          </TabsTrigger>
          <TabsTrigger value="faturadas">
            Faturadas ({guiasFaturadas.length})
          </TabsTrigger>
          <TabsTrigger value="pagas">
            Pagas ({guiasPagas.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="mt-6">
          <div className="space-y-4">
            {guiasPendentes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma guia pendente de faturamento</p>
              </div>
            ) : (
              guiasPendentes.map((guia) => (
                <GuiaCard key={guia.id} guia={guia} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="faturadas" className="mt-6">
          <div className="space-y-4">
            {guiasFaturadas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma guia faturada</p>
              </div>
            ) : (
              guiasFaturadas.map((guia) => (
                <GuiaCard key={guia.id} guia={guia} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pagas" className="mt-6">
          <div className="space-y-4">
            {guiasPagas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma guia paga</p>
              </div>
            ) : (
              guiasPagas.map((guia) => (
                <GuiaCard key={guia.id} guia={guia} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PainelFaturamento;
