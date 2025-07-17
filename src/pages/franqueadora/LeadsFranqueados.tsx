
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Phone, Mail, MapPin, Star, Users, TrendingUp } from "lucide-react";
import { useLeadsFranqueados, useCreateLead, useUpdateLead, type LeadFranqueado } from "@/hooks/useFranqueadora";
import { formatDate } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const LeadsFranqueados = () => {
  const { data: leads, isLoading } = useLeadsFranqueados();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadFranqueado | null>(null);
  const [newLead, setNewLead] = useState<Partial<LeadFranqueado>>({
    status: 'novo',
    score: 0,
    origem: 'site'
  });

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = !searchTerm || 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      lead.cidade_interesse?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'contatado': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'qualificado': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'apresentacao': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'proposta': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'aprovado': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejeitado': return 'bg-red-100 text-red-800 border-red-300';
      case 'perdido': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleCreateLead = () => {
    createLead.mutate(newLead as Omit<LeadFranqueado, "id" | "created_at" | "updated_at">, {
      onSuccess: () => {
        setIsNewLeadOpen(false);
        setNewLead({
          status: 'novo',
          score: 0,
          origem: 'site'
        });
      }
    });
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: string) => {
    updateLead.mutate({
      id: leadId,
      data: { status: newStatus as any }
    });
  };

  const statusStats = leads?.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leads de Franqueados</h1>
          <p className="text-muted-foreground">Gerencie interessados em adquirir uma franquia</p>
        </div>
        <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Lead</DialogTitle>
              <DialogDescription>
                Registre um novo interessado em franquia
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={newLead.nome || ""}
                    onChange={(e) => setNewLead(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="João da Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLead.email || ""}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="joao@email.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={newLead.telefone || ""}
                    onChange={(e) => setNewLead(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="origem">Origem do Lead</Label>
                  <Select 
                    value={newLead.origem || "site"} 
                    onValueChange={(value) => setNewLead(prev => ({ ...prev, origem: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="feira">Feira</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade_interesse">Cidade de Interesse</Label>
                  <Input
                    id="cidade_interesse"
                    value={newLead.cidade_interesse || ""}
                    onChange={(e) => setNewLead(prev => ({ ...prev, cidade_interesse: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="estado_interesse">Estado de Interesse</Label>
                  <Input
                    id="estado_interesse"
                    value={newLead.estado_interesse || ""}
                    onChange={(e) => setNewLead(prev => ({ ...prev, estado_interesse: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="capital_disponivel">Capital Disponível</Label>
                <Input
                  id="capital_disponivel"
                  type="number"
                  value={newLead.capital_disponivel || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, capital_disponivel: parseFloat(e.target.value) }))}
                  placeholder="100000"
                />
              </div>

              <div>
                <Label htmlFor="experiencia_empresarial">Experiência Empresarial</Label>
                <Textarea
                  id="experiencia_empresarial"
                  value={newLead.experiencia_empresarial || ""}
                  onChange={(e) => setNewLead(prev => ({ ...prev, experiencia_empresarial: e.target.value }))}
                  placeholder="Descreva a experiência empresarial do candidato..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewLeadOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateLead} disabled={createLead.isPending}>
                {createLead.isPending ? "Criando..." : "Criar Lead"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {statusStats['novo'] || 0} novos este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats['qualificado'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((statusStats['qualificado'] || 0) / (leads?.length || 1)) * 100)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Negociação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(statusStats['apresentacao'] || 0) + (statusStats['proposta'] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {statusStats['aprovado'] || 0} aprovados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(((statusStats['aprovado'] || 0) / (leads?.length || 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 15%
            </p>
          </CardContent>
        </Card>
      </div>

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

      {/* Cards dos Leads */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads?.map((lead) => (
          <Card key={lead.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{lead.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {lead.cidade_interesse}/{lead.estado_interesse}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(lead.status)} variant="outline">
                  {lead.status}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Score:</span>
                <span className={`font-bold ${getScoreColor(lead.score || 0)}`}>
                  {lead.score || 0}/100
                </span>
                <Progress value={lead.score || 0} className="flex-1 h-2" />
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{lead.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.telefone}</span>
                </div>

                {lead.capital_disponivel && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Capital:</span>
                    <span className="ml-1 font-medium">
                      R$ {lead.capital_disponivel.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Origem: {lead.origem} | Criado em {formatDate(lead.created_at || '')}
                </div>

                {lead.observacoes && (
                  <div className="text-sm p-2 bg-muted rounded">
                    <p className="text-muted-foreground text-xs mb-1">Observações:</p>
                    <p className="line-clamp-2">{lead.observacoes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Select
                    value={lead.status}
                    onValueChange={(value) => handleUpdateLeadStatus(lead.id, value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLeads?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum lead encontrado</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== "todos" ? "Tente ajustar os filtros" : "Comece adicionando seu primeiro lead"}
          </p>
        </div>
      )}
    </div>
  );
};

export default LeadsFranqueados;
