import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Search, Calendar, Download, User, Eye, RefreshCw, AlertCircle, Clock, AlertTriangle, ShoppingCart, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";
import { 
  useGuias, 
  useUpdateGuiaStatus, 
  useGuiasProximasVencimento,
  useEstornarGuia,
  isStatusTransitionAllowed,
  calcularDiasParaExpiracao,
  GUIA_STATUS 
} from "@/hooks/useGuias";
import { GuiaStatus, UserType } from "@/types/guias";
import VisualizarGuia from "@/components/guias/VisualizarGuia";
import { useCancelamentoPedido, useBuscarGuiasRelacionadas } from "@/hooks/useCancelamentoPedido";
import CancelamentoGuiaModal from "@/components/guias/CancelamentoGuiaModal";
import { formatarDadosPedido } from "@/utils/pedidoUtils";

const statusMap: Record<string, { label: string; color: string }> = {
  emitida: {
    label: "Emitida",
    color: "bg-yellow-100 hover:bg-yellow-100 text-yellow-800"
  },
  realizada: {
    label: "Realizada", 
    color: "bg-blue-100 hover:bg-blue-100 text-blue-800"
  },
  faturada: {
    label: "Faturada",
    color: "bg-green-100 hover:bg-green-100 text-green-800"
  },
  paga: {
    label: "Paga",
    color: "bg-gray-100 hover:bg-gray-100 text-gray-800"
  },
  cancelada: {
    label: "Cancelada",
    color: "bg-red-100 hover:bg-red-100 text-red-800"
  },
  estornada: {
    label: "Estornada",
    color: "bg-purple-100 hover:bg-purple-100 text-purple-800"
  },
  expirada: {
    label: "Expirada",
    color: "bg-orange-100 hover:bg-orange-100 text-orange-800"
  }
};

const Guias: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("todas");
  const [guiaSelecionada, setGuiaSelecionada] = useState<any>(null);
  const [showVisualizarGuia, setShowVisualizarGuia] = useState(false);
  const [showCancelamentoModal, setShowCancelamentoModal] = useState(false);
  const [guiaParaCancelar, setGuiaParaCancelar] = useState<any>(null);
  const [guiasRelacionadas, setGuiasRelacionadas] = useState<any[]>([]);
  
  // Simulando tipo de usuário - em produção viria do contexto de auth
  const [userType] = useState<UserType>('unidade');
  
  const { data: guias, isLoading, error, refetch } = useGuias();
  const { data: guiasProximasVencimento } = useGuiasProximasVencimento();
  const { mutate: updateGuiaStatus, isPending: isUpdatingStatus } = useUpdateGuiaStatus();
  const { mutate: estornarGuia, isPending: isEstornandoGuia } = useEstornarGuia();
  const { mutate: cancelarPedido, isPending: isCancelingPedido } = useCancelamentoPedido();
  const { mutate: buscarGuiasRelacionadas, isPending: isBuscandoGuias } = useBuscarGuiasRelacionadas();
  
  if (error) {
    console.error('Erro ao carregar guias:', error);
  }
  
  // Calcular estatísticas
  const totalEmitidas = guias?.filter(g => g.status === "emitida").length || 0;
  const totalRealizadas = guias?.filter(g => g.status === "realizada").length || 0;
  const totalFaturadas = guias?.filter(g => g.status === "faturada").length || 0;
  const totalPagas = guias?.filter(g => g.status === "paga").length || 0;
  const totalExpiradas = guias?.filter(g => g.status === "expirada").length || 0;
  
  // Filtrar guias
  const guiasFiltradas = guias?.filter(guia => {
    const vendaInfo = Array.isArray(guia.vendas_servicos) ? guia.vendas_servicos[0] : null;
    const dadosPedido = formatarDadosPedido(vendaInfo);
    
    const matchesSearch = 
      guia.servicos?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.clientes?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.prestadores?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guia.codigo_autenticacao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dadosPedido.numeroPedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === "all" || guia.status === statusFilter;
    
    const matchesTab = 
      activeTab === "todas" || 
      (activeTab === "emitidas" && guia.status === "emitida") ||
      (activeTab === "realizadas" && guia.status === "realizada") ||
      (activeTab === "faturadas" && guia.status === "faturada") ||
      (activeTab === "pagas" && guia.status === "paga") ||
      (activeTab === "expiradas" && guia.status === "expirada");
    
    return matchesSearch && matchesStatus && matchesTab;
  }) || [];
  
  // Formatar valor em reais
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  // Calcular valor total por status
  const calcularValorPorStatus = (status: string) => {
    return guias?.filter(g => g.status === status)
      .reduce((acc, g) => acc + (g.valor || 0), 0) || 0;
  };

  const handleUpdateStatus = (guiaId: string, newStatus: GuiaStatus) => {
    updateGuiaStatus({ guiaId, status: newStatus, userType }, {
      onSuccess: () => {
        toast({
          title: "Status atualizado",
          description: `Guia marcada como ${statusMap[newStatus]?.label.toLowerCase()}`,
        });
      },
      onError: (error) => {
        console.error('Erro ao atualizar status:', error);
        toast({
          title: "Erro ao atualizar status",
          description: error.message || "Ocorreu um erro ao atualizar o status da guia.",
          variant: "destructive"
        });
      }
    });
  };

  const handleCancelarGuia = async (guia: any) => {
    console.log('Iniciando cancelamento da guia:', guia.id);
    
    // Buscar guias relacionadas primeiro
    buscarGuiasRelacionadas(guia.id, {
      onSuccess: (guiasEncontradas) => {
        console.log('Guias relacionadas encontradas:', guiasEncontradas);
        setGuiaParaCancelar(guia);
        setGuiasRelacionadas(guiasEncontradas);
        setShowCancelamentoModal(true);
      },
      onError: (error) => {
        console.error('Erro ao buscar guias relacionadas:', error);
        toast({
          title: "Erro",
          description: "Erro ao buscar informações do pedido.",
          variant: "destructive"
        });
      }
    });
  };

  const confirmarCancelamento = () => {
    if (!guiaParaCancelar) return;

    cancelarPedido({ guiaId: guiaParaCancelar.id, userType }, {
      onSuccess: (resultado) => {
        console.log('Pedido cancelado com sucesso:', resultado);
        toast({
          title: "Pedido cancelado",
          description: `${resultado.guiasCanceladas.length} guia(s) cancelada(s) e venda estornada.`,
        });
        setShowCancelamentoModal(false);
        setGuiaParaCancelar(null);
        setGuiasRelacionadas([]);
      },
      onError: (error) => {
        console.error('Erro ao cancelar pedido:', error);
        toast({
          title: "Erro ao cancelar pedido",
          description: error.message || "Ocorreu um erro ao cancelar o pedido.",
          variant: "destructive"
        });
      }
    });
  };

  const handleEstornarGuia = (guiaId: string) => {
    estornarGuia({ guiaId, userType }, {
      onSuccess: () => {
        toast({
          title: "Guia estornada",
          description: "A guia foi estornada com sucesso.",
        });
      },
      onError: (error) => {
        console.error('Erro ao estornar guia:', error);
        toast({
          title: "Erro ao estornar guia",
          description: error.message || "Ocorreu um erro ao estornar a guia.",
          variant: "destructive"
        });
      }
    });
  };

  const visualizarGuia = (guia: any) => {
    setGuiaSelecionada(guia);
    setShowVisualizarGuia(true);
  };

  const renderStatusActions = (guia: any) => {
    const currentStatus = guia.status;
    const actions = [];

    // Ações baseadas no tipo de usuário e status atual
    if (userType === 'unidade') {
      if (currentStatus === 'faturada' && isStatusTransitionAllowed(currentStatus, 'paga', userType)) {
        actions.push(
          <Button 
            key="pagar"
            variant="ghost" 
            size="sm"
            onClick={() => handleUpdateStatus(guia.id, 'paga')}
            disabled={isUpdatingStatus}
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            Marcar Paga
          </Button>
        );
      }
      
      if (['emitida', 'realizada', 'faturada'].includes(currentStatus)) {
        actions.push(
          <Button 
            key="cancelar"
            variant="ghost" 
            size="sm"
            onClick={() => handleCancelarGuia(guia)}
            disabled={isCancelingPedido || isBuscandoGuias}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isBuscandoGuias ? "Verificando..." : "Cancelar"}
          </Button>
        );
      }

      if (currentStatus === 'paga') {
        actions.push(
          <Button 
            key="estornar"
            variant="ghost" 
            size="sm"
            onClick={() => handleEstornarGuia(guia.id)}
            disabled={isEstornandoGuia}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            Estornar
          </Button>
        );
      }
    }

    return actions;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-agendaja-primary" />
          <p className="text-gray-500">Carregando guias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p className="text-gray-500 mb-4">Erro ao carregar guias</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Guias de Atendimento</h2>
          <p className="text-gray-500 mt-1">
            Gerencie todas as guias de serviço emitidas ({guias?.length || 0} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Alerta para guias próximas do vencimento */}
      {guiasProximasVencimento && guiasProximasVencimento.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{guiasProximasVencimento.length} guia(s)</strong> próximas do vencimento (30 dias).
            <Button variant="link" className="p-0 ml-2 text-orange-800" onClick={() => setStatusFilter('emitida')}>
              Ver guias
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Cards reorganizados com melhor layout */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <Card className={`border-l-4 ${activeTab === "emitidas" ? "border-l-yellow-500" : "border-l-transparent"} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-medium text-gray-500">Emitidas</p>
                <Badge variant="outline" className="bg-yellow-100 hover:bg-yellow-100 text-yellow-800 text-xs">
                  {totalEmitidas}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  {formatarValor(calcularValorPorStatus("emitida"))}
                </p>
                <p className="text-xs text-gray-400">Total emitido</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "realizadas" ? "border-l-blue-500" : "border-l-transparent"} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-medium text-gray-500">Realizadas</p>
                <Badge variant="outline" className="bg-blue-100 hover:bg-blue-100 text-blue-800 text-xs">
                  {totalRealizadas}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  {formatarValor(calcularValorPorStatus("realizada"))}
                </p>
                <p className="text-xs text-gray-400">Total realizado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "faturadas" ? "border-l-green-500" : "border-l-transparent"} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-medium text-gray-500">Faturadas</p>
                <Badge variant="outline" className="bg-green-100 hover:bg-green-100 text-green-800 text-xs">
                  {totalFaturadas}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  {formatarValor(calcularValorPorStatus("faturada"))}
                </p>
                <p className="text-xs text-gray-400">Total faturado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`border-l-4 ${activeTab === "pagas" ? "border-l-gray-500" : "border-l-transparent"} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-medium text-gray-500">Pagas</p>
                <Badge variant="outline" className="bg-gray-100 hover:bg-gray-100 text-gray-800 text-xs">
                  {totalPagas}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  {formatarValor(calcularValorPorStatus("paga"))}
                </p>
                <p className="text-xs text-gray-400">Total pago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${activeTab === "expiradas" ? "border-l-orange-500" : "border-l-transparent"} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs md:text-sm font-medium text-gray-500">Expiradas</p>
                <Badge variant="outline" className="bg-orange-100 hover:bg-orange-100 text-orange-800 text-xs">
                  {totalExpiradas}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-lg md:text-xl font-bold leading-tight">
                  {formatarValor(calcularValorPorStatus("expirada"))}
                </p>
                <p className="text-xs text-gray-400">Total expirado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="overflow-x-auto">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="todas" className="whitespace-nowrap">Todas</TabsTrigger>
                  <TabsTrigger value="emitidas" className="whitespace-nowrap">Emitidas</TabsTrigger>
                  <TabsTrigger value="realizadas" className="whitespace-nowrap">Realizadas</TabsTrigger>
                  <TabsTrigger value="faturadas" className="whitespace-nowrap">Faturadas</TabsTrigger>
                  <TabsTrigger value="pagas" className="whitespace-nowrap">Pagas</TabsTrigger>
                  <TabsTrigger value="expiradas" className="whitespace-nowrap">Expiradas</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por código, pedido, cliente..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="emitida">Emitidas</SelectItem>
                  <SelectItem value="realizada">Realizadas</SelectItem>
                  <SelectItem value="faturada">Faturadas</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                  <SelectItem value="estornada">Estornadas</SelectItem>
                  <SelectItem value="expirada">Expiradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Código</TableHead>
                    <TableHead className="whitespace-nowrap">Pedido</TableHead>
                    <TableHead className="whitespace-nowrap">Cliente</TableHead>
                    <TableHead className="whitespace-nowrap">Prestador</TableHead>
                    <TableHead className="whitespace-nowrap">Serviço</TableHead>
                    <TableHead className="whitespace-nowrap">Valor</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guiasFiltradas.map((guia) => {
                    const diasParaExpiracao = calcularDiasParaExpiracao(guia.data_emissao);
                    const proximaExpiracao = diasParaExpiracao <= 5 && diasParaExpiracao > 0 && guia.status === 'emitida';
                    const vendaInfo = Array.isArray(guia.vendas_servicos) ? guia.vendas_servicos[0] : null;
                    const dadosPedido = formatarDadosPedido(vendaInfo);
                    
                    return (
                      <TableRow key={guia.id} className={proximaExpiracao ? 'bg-orange-50' : ''}>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <span className="truncate max-w-[120px]">{guia.codigo_autenticacao}</span>
                            {proximaExpiracao && (
                              <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Package className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-mono text-sm font-medium truncate">{dadosPedido.numeroPedido}</span>
                              <span className="text-xs text-gray-500 truncate">
                                {formatarValor(dadosPedido.valorTotal)}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center min-w-0">
                            <div className="h-8 w-8 rounded-full bg-agendaja-light flex items-center justify-center mr-2 flex-shrink-0">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="font-medium truncate block">{guia.clientes?.nome}</span>
                              {guia.clientes?.id_associado && (
                                <p className="text-xs text-gray-500 truncate">ID: {guia.clientes.id_associado}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="truncate block max-w-[150px]">{guia.prestadores?.nome || "Não informado"}</span>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div>
                            <p className="font-medium truncate">{guia.servicos?.nome}</p>
                            <p className="text-xs text-gray-500 truncate">{guia.servicos?.categoria}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {formatarValor(guia.valor)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500 flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="whitespace-nowrap">{format(new Date(guia.data_emissao), "dd/MM/yyyy", { locale: ptBR })}</span>
                              {guia.status !== "emitida" && (
                                <span className="text-xs text-gray-500 truncate">
                                  {guia.status === "paga" && guia.data_pagamento
                                    ? `Paga: ${format(new Date(guia.data_pagamento), "dd/MM", { locale: ptBR })}`
                                    : guia.status === "faturada" && guia.data_faturamento
                                      ? `Faturada: ${format(new Date(guia.data_faturamento), "dd/MM", { locale: ptBR })}`
                                      : guia.status === "realizada" && guia.data_realizacao
                                        ? `Realizada: ${format(new Date(guia.data_realizacao), "dd/MM", { locale: ptBR })}`
                                        : null
                                  }
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${statusMap[guia.status]?.color || "bg-gray-100 text-gray-800"} whitespace-nowrap`}
                          >
                            {statusMap[guia.status]?.label || guia.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => visualizarGuia(guia)}
                              className="text-agendaja-primary hover:text-agendaja-primary/80 hover:bg-agendaja-light/50 whitespace-nowrap"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            {renderStatusActions(guia)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  
                  {guiasFiltradas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">
                            {searchTerm || statusFilter !== "all" 
                              ? "Nenhuma guia encontrada com os filtros aplicados." 
                              : "Nenhuma guia foi emitida ainda."
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de cancelamento */}
      {guiaParaCancelar && (
        <CancelamentoGuiaModal
          open={showCancelamentoModal}
          onOpenChange={setShowCancelamentoModal}
          guia={guiaParaCancelar}
          guiasRelacionadas={guiasRelacionadas}
          onConfirm={confirmarCancelamento}
          isLoading={isCancelingPedido}
        />
      )}

      {/* Modal de visualização da guia */}
      {guiaSelecionada && (
        <VisualizarGuia
          guia={guiaSelecionada}
          open={showVisualizarGuia}
          onOpenChange={setShowVisualizarGuia}
        />
      )}
    </div>
  );
};

export default Guias;
