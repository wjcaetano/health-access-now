
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Eye, Edit2, MoreHorizontal, MapPin, Building2, Users, DollarSign } from "lucide-react";
import { useFranquiasResumo, useCreateFranquia, type Franquia } from "@/hooks/useFranqueadora";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const GestaoFranquias = () => {
  const { data: franquias, isLoading } = useFranquiasResumo();
  const createFranquia = useCreateFranquia();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isNewFranquiaOpen, setIsNewFranquiaOpen] = useState(false);
  const [newFranquia, setNewFranquia] = useState<Partial<Franquia>>({
    status: 'em_implantacao',
    tipo_franquia: 'tradicional',
    taxa_royalty: 5.00,
    taxa_marketing: 2.00
  });

  const filteredFranquias = franquias?.filter(franquia => {
    const matchesSearch = !searchTerm || 
      franquia.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franquia.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franquia.estado?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || franquia.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'bg-green-100 text-green-800 border-green-300';
      case 'suspensa': return 'bg-red-100 text-red-800 border-red-300';
      case 'em_implantacao': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inativa': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCreateFranquia = () => {
    createFranquia.mutate(newFranquia as Omit<Franquia, "id" | "created_at" | "updated_at">, {
      onSuccess: () => {
        setIsNewFranquiaOpen(false);
        setNewFranquia({
          status: 'em_implantacao',
          tipo_franquia: 'tradicional',
          taxa_royalty: 5.00,
          taxa_marketing: 2.00
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
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
          <h1 className="text-3xl font-bold">Gestão de Franquias</h1>
          <p className="text-muted-foreground">Gerencie todas as unidades da rede</p>
        </div>
        <Dialog open={isNewFranquiaOpen} onOpenChange={setIsNewFranquiaOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Franquia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Franquia</DialogTitle>
              <DialogDescription>
                Adicione uma nova unidade à rede de franquias
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    value={newFranquia.nome_fantasia || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, nome_fantasia: e.target.value }))}
                    placeholder="AGENDAJA - Unidade Centro"
                  />
                </div>
                <div>
                  <Label htmlFor="razao_social">Razão Social</Label>
                  <Input
                    id="razao_social"
                    value={newFranquia.razao_social || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, razao_social: e.target.value }))}
                    placeholder="Empresa Ltda"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={newFranquia.cnpj || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, cnpj: e.target.value }))}
                    placeholder="00.000.000/0001-00"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newFranquia.email || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@agendaja.com.br"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={newFranquia.telefone || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, telefone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={newFranquia.cidade || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, cidade: e.target.value }))}
                    placeholder="São Paulo"
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={newFranquia.estado || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, estado: e.target.value }))}
                    placeholder="SP"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="endereco_completo">Endereço Completo</Label>
                <Textarea
                  id="endereco_completo"
                  value={newFranquia.endereco_completo || ""}
                  onChange={(e) => setNewFranquia(prev => ({ ...prev, endereco_completo: e.target.value }))}
                  placeholder="Rua, número, bairro, CEP"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo_franquia">Tipo de Franquia</Label>
                  <Select 
                    value={newFranquia.tipo_franquia} 
                    onValueChange={(value) => setNewFranquia(prev => ({ ...prev, tipo_franquia: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tradicional">Tradicional</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="microfranquia">Microfranquia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="valor_investimento">Valor do Investimento</Label>
                  <Input
                    id="valor_investimento"
                    type="number"
                    value={newFranquia.valor_investimento || ""}
                    onChange={(e) => setNewFranquia(prev => ({ ...prev, valor_investimento: parseFloat(e.target.value) }))}
                    placeholder="50000.00"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsNewFranquiaOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateFranquia} disabled={createFranquia.isPending}>
                {createFranquia.isPending ? "Criando..." : "Criar Franquia"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar franquias..."
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
            <SelectItem value="">Todos os status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="em_implantacao">Em Implantação</SelectItem>
            <SelectItem value="suspensa">Suspensa</SelectItem>
            <SelectItem value="inativa">Inativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards das Franquias */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFranquias?.map((franquia) => (
          <Card key={franquia.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{franquia.nome_fantasia}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {franquia.cidade}/{franquia.estado}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge className={getStatusColor(franquia.status || '')} variant="outline">
                {franquia.status}
              </Badge>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Franqueado
                  </span>
                  <span className="text-sm font-medium">
                    {franquia.franqueado_nome || "Não definido"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Clientes
                  </span>
                  <span className="text-sm font-medium">
                    {franquia.total_clientes || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Faturamento
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(franquia.faturamento_total || 0)}
                  </span>
                </div>

                {franquia.royalties_atrasados && franquia.royalties_atrasados > 0 && (
                  <div className="p-2 rounded-md bg-red-50 border border-red-200">
                    <p className="text-xs text-red-600">
                      {franquia.royalties_atrasados} royalties em atraso
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFranquias?.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhuma franquia encontrada</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter ? "Tente ajustar os filtros" : "Comece criando sua primeira franquia"}
          </p>
        </div>
      )}
    </div>
  );
};

export default GestaoFranquias;
