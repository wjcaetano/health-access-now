
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Clock, User, Eye, GitBranch } from "lucide-react";

interface ContractChange {
  id: string;
  numero_contrato: string;
  franquia_nome: string;
  tipo_alteracao: 'valor' | 'prazo' | 'clausula' | 'condicoes' | 'territorio' | 'rescisao';
  descricao: string;
  valor_anterior?: string;
  valor_novo?: string;
  data_alteracao: string;
  responsavel: string;
  aprovado_por?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado' | 'implementado';
  observacoes?: string;
}

const mockChanges: ContractChange[] = [
  {
    id: '1',
    numero_contrato: 'CTR-2024-001',
    franquia_nome: 'AGENDAJA São Paulo Centro',
    tipo_alteracao: 'valor',
    descricao: 'Alteração do valor da taxa de royalty',
    valor_anterior: '5%',
    valor_novo: '4.5%',
    data_alteracao: '2024-07-28',
    responsavel: 'Maria Santos',
    aprovado_por: 'João Diretor',
    status: 'aprovado',
    observacoes: 'Aprovado devido ao bom desempenho da franquia'
  },
  {
    id: '2',
    numero_contrato: 'CTR-2024-002',
    franquia_nome: 'AGENDAJA Rio de Janeiro',
    tipo_alteracao: 'prazo',
    descricao: 'Extensão do prazo contratual',
    valor_anterior: '5 anos',
    valor_novo: '7 anos',
    data_alteracao: '2024-07-25',
    responsavel: 'Ana Costa',
    status: 'pendente',
    observacoes: 'Aguardando aprovação da diretoria'
  },
  {
    id: '3',
    numero_contrato: 'CTR-2024-003',
    franquia_nome: 'AGENDAJA Belo Horizonte',
    tipo_alteracao: 'territorio',
    descricao: 'Expansão do território exclusivo',
    valor_anterior: 'Belo Horizonte Centro',
    valor_novo: 'Região Metropolitana de BH',
    data_alteracao: '2024-07-20',
    responsavel: 'Carlos Silva',
    aprovado_por: 'Maria Diretora',
    status: 'implementado',
    observacoes: 'Alteração implementada com sucesso'
  },
  {
    id: '4',
    numero_contrato: 'CTR-2024-004',
    franquia_nome: 'AGENDAJA Porto Alegre',
    tipo_alteracao: 'clausula',
    descricao: 'Adição de cláusula de não concorrência',
    valor_anterior: 'Não especificado',
    valor_novo: '2 anos após rescisão',
    data_alteracao: '2024-07-15',
    responsavel: 'Luisa Ferreira',
    status: 'rejeitado',
    observacoes: 'Rejeitado pelo franqueado'
  }
];

export default function ChangeHistory() {
  const [changes] = useState<ContractChange[]>(mockChanges);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");

  const filteredChanges = changes.filter(change => {
    const matchesSearch = change.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.franquia_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         change.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "todos" || change.tipo_alteracao === selectedType;
    const matchesStatus = selectedStatus === "todos" || change.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'valor': return 'bg-blue-100 text-blue-800';
      case 'prazo': return 'bg-green-100 text-green-800';
      case 'clausula': return 'bg-purple-100 text-purple-800';
      case 'condicoes': return 'bg-orange-100 text-orange-800';
      case 'territorio': return 'bg-teal-100 text-teal-800';
      case 'rescisao': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'implementado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'valor': return 'Valor';
      case 'prazo': return 'Prazo';
      case 'clausula': return 'Cláusula';
      case 'condicoes': return 'Condições';
      case 'territorio': return 'Território';
      case 'rescisao': return 'Rescisão';
      default: return tipo;
    }
  };

  const statusStats = {
    pendente: changes.filter(c => c.status === 'pendente').length,
    aprovado: changes.filter(c => c.status === 'aprovado').length,
    rejeitado: changes.filter(c => c.status === 'rejeitado').length,
    implementado: changes.filter(c => c.status === 'implementado').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Histórico de Alterações</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe todas as mudanças contratuais
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-900">{statusStats.pendente}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Aprovados</p>
                <p className="text-2xl font-bold text-green-900">{statusStats.aprovado}</p>
              </div>
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Rejeitados</p>
                <p className="text-2xl font-bold text-red-900">{statusStats.rejeitado}</p>
              </div>
              <GitBranch className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Implementados</p>
                <p className="text-2xl font-bold text-blue-900">{statusStats.implementado}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por contrato, franquia ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="todos">Todos os tipos</option>
          <option value="valor">Valor</option>
          <option value="prazo">Prazo</option>
          <option value="clausula">Cláusula</option>
          <option value="condicoes">Condições</option>
          <option value="territorio">Território</option>
          <option value="rescisao">Rescisão</option>
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="todos">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="aprovado">Aprovado</option>
          <option value="rejeitado">Rejeitado</option>
          <option value="implementado">Implementado</option>
        </select>
      </div>

      {/* Changes List */}
      <div className="space-y-4">
        {filteredChanges.map((change) => (
          <Card key={change.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-semibold">{change.numero_contrato}</h4>
                    <Badge className={getTypeColor(change.tipo_alteracao)}>
                      {getTypeLabel(change.tipo_alteracao)}
                    </Badge>
                    <Badge className={getStatusColor(change.status)}>
                      {change.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="font-medium text-sm mb-1">{change.franquia_nome}</p>
                  <p className="text-sm text-muted-foreground mb-4">{change.descricao}</p>
                  
                  {(change.valor_anterior || change.valor_novo) && (
                    <div className="bg-muted/50 p-3 rounded-lg mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Valor Anterior</p>
                          <p className="font-medium">{change.valor_anterior || 'Não especificado'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Valor Novo</p>
                          <p className="font-medium text-green-600">{change.valor_novo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Data da Alteração</p>
                      <p className="font-medium">
                        {new Date(change.data_alteracao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Responsável</p>
                      <p className="font-medium flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {change.responsavel}
                      </p>
                    </div>
                    {change.aprovado_por && (
                      <div>
                        <p className="text-muted-foreground">Aprovado por</p>
                        <p className="font-medium flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {change.aprovado_por}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {change.observacoes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Observações:</strong> {change.observacoes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="lg:w-48">
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-3 w-3 mr-1" />
                      Ver Contrato
                    </Button>
                    {change.status === 'pendente' && (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Aprovar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChanges.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma alteração encontrada
          </h3>
          <p className="text-muted-foreground">
            Não há alterações que correspondam aos filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}
