import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Plus, 
  Filter, 
  Search, 
  TrendingUp, 
  Star,
  MessageSquare,
  BarChart3,
  Settings
} from "lucide-react";
import { useLeadsFranqueados, useUpdateLead } from "@/hooks/useFranqueadora";
import { LeadScoringSystem } from "@/components/franqueadora/crm/LeadScoringSystem";
import { SalesPipeline } from "@/components/franqueadora/crm/SalesPipeline";
import { FollowUpAutomation } from "@/components/franqueadora/crm/FollowUpAutomation";
import { ConversionReports } from "@/components/franqueadora/crm/ConversionReports";
import { Skeleton } from "@/components/ui/skeleton";

const CRMFranqueados = () => {
  const { data: leads, isLoading } = useLeadsFranqueados();
  const updateLead = useUpdateLead();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      lead.cidade_interesse?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLead.mutate({
      id: leadId,
      data: { status: newStatus as any }
    });
  };

  const handleScoreUpdate = (leadId: string, newScore: number) => {
    updateLead.mutate({
      id: leadId,
      data: { score: newScore }
    });
  };

  // Métricas do dashboard
  const totalLeads = leads?.length || 0;
  const qualifiedLeads = leads?.filter(l => l.status === 'qualificado').length || 0;
  const conversionRate = totalLeads > 0 
    ? Math.round(((leads?.filter(l => l.status === 'aprovado').length || 0) / totalLeads) * 100)
    : 0;
  const avgScore = leads?.length 
    ? Math.round(leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / leads.length)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM de Franqueados</h1>
          <p className="text-muted-foreground">Sistema avançado de gestão de relacionamento com franqueados</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualifiedLeads}</div>
            <p className="text-xs text-muted-foreground">
              Score médio: {avgScore}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Meta: 15%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Ativos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              3 agendados hoje
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo principal em abas */}
      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          {/* Filtros */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="contatado">Contatado</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="apresentacao">Apresentação</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SalesPipeline 
            leads={filteredLeads} 
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="scoring" className="space-y-4">
          <div className="grid gap-6">
            {selectedLead ? (
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedLead(null)}
                >
                  ← Voltar para lista
                </Button>
                {filteredLeads.find(l => l.id === selectedLead) && (
                  <LeadScoringSystem 
                    lead={filteredLeads.find(l => l.id === selectedLead)!}
                    onScoreUpdate={(newScore) => handleScoreUpdate(selectedLead, newScore)}
                  />
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sistema de Pontuação de Leads</CardTitle>
                    <CardDescription>
                      Selecione um lead para ver análise detalhada de pontuação
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredLeads.slice(0, 6).map((lead) => (
                        <Card 
                          key={lead.id} 
                          className="cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => setSelectedLead(lead.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{lead.nome}</h3>
                              <Badge variant={lead.score >= 60 ? "default" : "secondary"}>
                                {lead.score}/100
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {lead.cidade_interesse} • {lead.origem}
                            </p>
                            {lead.capital_disponivel && (
                              <p className="text-sm font-medium text-green-600">
                                R$ {lead.capital_disponivel.toLocaleString()}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <FollowUpAutomation />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ConversionReports leads={filteredLeads} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do CRM
              </CardTitle>
              <CardDescription>
                Configure parâmetros do sistema de CRM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Parâmetros de Pontuação</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Capital Mínimo (Peso: 30%)</label>
                      <Input placeholder="R$ 50.000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Score Mínimo para Qualificação</label>
                      <Input placeholder="60" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Automações Padrão</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Enviar e-mail de boas-vindas automaticamente</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Agendar follow-up após 3 dias sem resposta</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Enviar relatório semanal de conversões</span>
                    </label>
                  </div>
                </div>

                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMFranqueados;
