
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, AlertTriangle, Clock, FileText, Send } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface ContractExpiration {
  id: string;
  numero_contrato: string;
  franquia_nome: string;
  franquia_cidade: string;
  data_vencimento: string;
  dias_para_vencer: number;
  valor_inicial: number;
  taxa_royalty: number;
  status: 'ativo' | 'vencido' | 'renovado';
  urgencia: 'baixa' | 'media' | 'alta' | 'critica';
}

const mockContracts: ContractExpiration[] = [
  {
    id: '1',
    numero_contrato: 'CTR-2024-001',
    franquia_nome: 'AGENDAJA São Paulo Centro',
    franquia_cidade: 'São Paulo, SP',
    data_vencimento: '2024-08-15',
    dias_para_vencer: 15,
    valor_inicial: 85000,
    taxa_royalty: 5,
    status: 'ativo',
    urgencia: 'critica'
  },
  {
    id: '2',
    numero_contrato: 'CTR-2024-002',
    franquia_nome: 'AGENDAJA Rio de Janeiro',
    franquia_cidade: 'Rio de Janeiro, RJ',
    data_vencimento: '2024-09-22',
    dias_para_vencer: 53,
    valor_inicial: 120000,
    taxa_royalty: 5,
    status: 'ativo',
    urgencia: 'alta'
  },
  {
    id: '3',
    numero_contrato: 'CTR-2024-003',
    franquia_nome: 'AGENDAJA Belo Horizonte',
    franquia_cidade: 'Belo Horizonte, MG',
    data_vencimento: '2024-11-10',
    dias_para_vencer: 102,
    valor_inicial: 95000,
    taxa_royalty: 5,
    status: 'ativo',
    urgencia: 'media'
  },
  {
    id: '4',
    numero_contrato: 'CTR-2023-015',
    franquia_nome: 'AGENDAJA Porto Alegre',
    franquia_cidade: 'Porto Alegre, RS',
    data_vencimento: '2024-07-20',
    dias_para_vencer: -10,
    valor_inicial: 78000,
    taxa_royalty: 5,
    status: 'vencido',
    urgencia: 'critica'
  }
];

export default function ExpirationControl() {
  const [contracts] = useState<ContractExpiration[]>(mockContracts);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("todos");

  const filteredContracts = contracts.filter(contract => {
    if (selectedUrgency === "todos") return true;
    return contract.urgencia === selectedUrgency;
  });

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica': return 'bg-red-100 text-red-800 border-red-200';
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-blue-100 text-blue-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      case 'renovado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (dias: number) => {
    if (dias < 0) return 100; // Vencido
    if (dias > 120) return 0; // Muito tempo ainda
    return Math.max(0, Math.min(100, ((120 - dias) / 120) * 100));
  };

  const urgencyStats = {
    critica: contracts.filter(c => c.urgencia === 'critica').length,
    alta: contracts.filter(c => c.urgencia === 'alta').length,
    media: contracts.filter(c => c.urgencia === 'media').length,
    baixa: contracts.filter(c => c.urgencia === 'baixa').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Controle de Vencimentos</h3>
          <p className="text-sm text-muted-foreground">
            Monitore contratos próximos ao vencimento
          </p>
        </div>
        <Button>
          <Send className="h-4 w-4 mr-2" />
          Enviar Alertas
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Crítico</p>
                <p className="text-2xl font-bold text-red-900">{urgencyStats.critica}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Alto</p>
                <p className="text-2xl font-bold text-orange-900">{urgencyStats.alta}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Médio</p>
                <p className="text-2xl font-bold text-yellow-900">{urgencyStats.media}</p>
              </div>
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Baixo</p>
                <p className="text-2xl font-bold text-green-900">{urgencyStats.baixa}</p>
              </div>
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={selectedUrgency}
          onChange={(e) => setSelectedUrgency(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="todos">Todas as urgências</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{contract.numero_contrato}</h4>
                    <Badge className={getUrgencyColor(contract.urgencia)}>
                      {contract.urgencia.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="font-medium text-sm mb-1">{contract.franquia_nome}</p>
                  <p className="text-sm text-muted-foreground mb-3">{contract.franquia_cidade}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Vencimento</p>
                      <p className="font-medium">
                        {new Date(contract.data_vencimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dias para vencer</p>
                      <p className={`font-medium ${contract.dias_para_vencer < 0 ? 'text-red-600' : 
                        contract.dias_para_vencer < 30 ? 'text-orange-600' : 'text-foreground'}`}>
                        {contract.dias_para_vencer < 0 ? 
                          `${Math.abs(contract.dias_para_vencer)} dias vencido` : 
                          `${contract.dias_para_vencer} dias`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor Inicial</p>
                      <p className="font-medium">{formatCurrency(contract.valor_inicial)}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-64 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Urgência</span>
                      <span>{getProgressPercentage(contract.dias_para_vencer).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(contract.dias_para_vencer)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-3 w-3 mr-1" />
                      Ver Contrato
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Send className="h-3 w-3 mr-1" />
                      Renovar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum contrato encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há contratos com a urgência selecionada.
          </p>
        </div>
      )}
    </div>
  );
}
