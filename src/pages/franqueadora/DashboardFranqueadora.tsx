
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, DollarSign, AlertTriangle, Plus, Eye } from "lucide-react";
import { useMetricasFranqueadora, useFranquiasResumo, useLeadsFranqueados } from "@/hooks/useFranqueadora";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";

const DashboardFranqueadora = () => {
  const { data: metricas, isLoading: loadingMetricas } = useMetricasFranqueadora();
  const { data: franquiasResumo, isLoading: loadingFranquias } = useFranquiasResumo();
  const { data: leads, isLoading: loadingLeads } = useLeadsFranqueados();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800';
      case 'suspensa': return 'bg-red-100 text-red-800';
      case 'em_implantacao': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'qualificado': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'em_negociacao': return 'bg-yellow-100 text-yellow-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingMetricas) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Painel Executivo</h1>
          <p className="text-muted-foreground">Visão consolidada da rede de franquias</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/franqueadora/leads">
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/franqueadora/franquias">
              <Building2 className="h-4 w-4 mr-2" />
              Gerenciar Franquias
            </Link>
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Franquias</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.totalFranquias}</div>
            <p className="text-xs text-muted-foreground">
              {metricas?.franquiasAtivas} ativas na rede
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads de Franqueados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricas?.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {metricas?.leadsQualificados} qualificados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Royalties Pendentes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metricas?.valorRoyaltiesPendentes || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metricas?.royaltiesPendentes} unidades pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              vs. mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Franquias com Melhor Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Franquias</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/franqueadora/franquias">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Unidades com melhor faturamento</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFranquias ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {franquiasResumo?.slice(0, 5).map((franquia, index) => (
                  <div key={franquia.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{franquia.nome_fantasia}</p>
                        <p className="text-sm text-muted-foreground">
                          {franquia.cidade}/{franquia.estado}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatCurrency(franquia.faturamento_total || 0)}
                      </p>
                      <Badge className={getStatusColor(franquia.status || '')} variant="outline">
                        {franquia.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Leads Recentes</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/franqueadora/leads">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Novos interessados em franquias</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLeads ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {leads?.slice(0, 5).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{lead.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {lead.cidade_interesse}/{lead.estado_interesse}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getLeadStatusColor(lead.status)} variant="outline">
                        {lead.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Score: {lead.score}/100
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações Necessárias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Ações Necessárias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg border-yellow-200 bg-yellow-50">
              <h4 className="font-medium text-yellow-800">Royalties em Atraso</h4>
              <p className="text-sm text-yellow-600 mt-1">
                {metricas?.royaltiesPendentes} unidades com pagamentos pendentes
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link to="/franqueadora/royalties">Ver Detalhes</Link>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
              <h4 className="font-medium text-blue-800">Leads para Contato</h4>
              <p className="text-sm text-blue-600 mt-1">
                {leads?.filter(l => l.status === 'novo').length} novos leads aguardando contato
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link to="/franqueadora/leads">Entrar em Contato</Link>
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg border-green-200 bg-green-50">
              <h4 className="font-medium text-green-800">Contratos para Renovar</h4>
              <p className="text-sm text-green-600 mt-1">
                3 contratos vencem nos próximos 90 dias
              </p>
              <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link to="/franqueadora/contratos">Verificar</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardFranqueadora;
