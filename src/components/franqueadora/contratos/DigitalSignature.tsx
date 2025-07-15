
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Send, CheckCircle, Clock, AlertCircle, Eye, Download } from "lucide-react";

interface DocumentSignature {
  id: string;
  numero_contrato: string;
  nome_documento: string;
  franquia_nome: string;
  signatarios: {
    nome: string;
    email: string;
    cargo: string;
    status: 'pendente' | 'assinado' | 'recusado';
    data_assinatura?: string;
  }[];
  status: 'preparando' | 'enviado' | 'parcial' | 'concluido' | 'cancelado';
  data_criacao: string;
  data_limite: string;
  progresso: number;
}

const mockDocuments: DocumentSignature[] = [
  {
    id: '1',
    numero_contrato: 'CTR-2024-004',
    nome_documento: 'Contrato de Franquia - São Paulo Centro',
    franquia_nome: 'AGENDAJA São Paulo Centro',
    status: 'enviado',
    data_criacao: '2024-07-25',
    data_limite: '2024-08-10',
    progresso: 50,
    signatarios: [
      {
        nome: 'João Silva',
        email: 'joao@franqueado.com',
        cargo: 'Franqueado',
        status: 'assinado',
        data_assinatura: '2024-07-26'
      },
      {
        nome: 'Maria Santos',
        email: 'maria@agendaja.com',
        cargo: 'Diretora Comercial',
        status: 'pendente'
      }
    ]
  },
  {
    id: '2',
    numero_contrato: 'CTR-2024-005',
    nome_documento: 'Aditivo Contratual - Rio de Janeiro',
    franquia_nome: 'AGENDAJA Rio de Janeiro',
    status: 'concluido',
    data_criacao: '2024-07-20',
    data_limite: '2024-08-05',
    progresso: 100,
    signatarios: [
      {
        nome: 'Carlos Oliveira',
        email: 'carlos@franqueado.com',
        cargo: 'Franqueado',
        status: 'assinado',
        data_assinatura: '2024-07-21'
      },
      {
        nome: 'Ana Costa',
        email: 'ana@agendaja.com',
        cargo: 'Gerente Jurídico',
        status: 'assinado',
        data_assinatura: '2024-07-22'
      }
    ]
  },
  {
    id: '3',
    numero_contrato: 'CTR-2024-006',
    nome_documento: 'Contrato Master - Minas Gerais',
    franquia_nome: 'AGENDAJA Minas Gerais Master',
    status: 'preparando',
    data_criacao: '2024-07-30',
    data_limite: '2024-08-15',
    progresso: 0,
    signatarios: [
      {
        nome: 'Pedro Martins',
        email: 'pedro@franqueado.com',
        cargo: 'Master Franqueado',
        status: 'pendente'
      },
      {
        nome: 'Luisa Ferreira',
        email: 'luisa@agendaja.com',
        cargo: 'CEO',
        status: 'pendente'
      }
    ]
  }
];

export default function DigitalSignature() {
  const [documents] = useState<DocumentSignature[]>(mockDocuments);
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");

  const filteredDocuments = documents.filter(doc => {
    if (selectedStatus === "todos") return true;
    return doc.status === selectedStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparando': return 'bg-gray-100 text-gray-800';
      case 'enviado': return 'bg-blue-100 text-blue-800';
      case 'parcial': return 'bg-yellow-100 text-yellow-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparando': return <Clock className="h-4 w-4" />;
      case 'enviado': return <Send className="h-4 w-4" />;
      case 'parcial': return <AlertCircle className="h-4 w-4" />;
      case 'concluido': return <CheckCircle className="h-4 w-4" />;
      case 'cancelado': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSignatureStatusColor = (status: string) => {
    switch (status) {
      case 'assinado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'recusado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const statusStats = {
    preparando: documents.filter(d => d.status === 'preparando').length,
    enviado: documents.filter(d => d.status === 'enviado').length,
    parcial: documents.filter(d => d.status === 'parcial').length,
    concluido: documents.filter(d => d.status === 'concluido').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Assinatura Digital</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie documentos para assinatura digital
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold">{statusStats.preparando}</p>
              </div>
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enviados</p>
                <p className="text-2xl font-bold">{statusStats.enviado}</p>
              </div>
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parciais</p>
                <p className="text-2xl font-bold">{statusStats.parcial}</p>
              </div>
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{statusStats.concluido}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="todos">Todos os status</option>
          <option value="preparando">Preparando</option>
          <option value="enviado">Enviado</option>
          <option value="parcial">Parcialmente Assinado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{document.nome_documento}</CardTitle>
                    <Badge className={getStatusColor(document.status)}>
                      {getStatusIcon(document.status)}
                      <span className="ml-1 capitalize">{document.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {document.numero_contrato} • {document.franquia_nome}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Criado em {new Date(document.data_criacao).toLocaleDateString('pt-BR')} • 
                    Prazo: {new Date(document.data_limite).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="lg:w-80">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso das Assinaturas</span>
                    <span>{document.progresso}%</span>
                  </div>
                  <Progress value={document.progresso} className="mb-3" />
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Visualizar
                    </Button>
                    {document.status === 'concluido' && (
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Baixar
                      </Button>
                    )}
                    {document.status === 'preparando' && (
                      <Button size="sm">
                        <Send className="h-3 w-3 mr-1" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div>
                <h5 className="font-medium mb-3">Signatários</h5>
                <div className="space-y-2">
                  {document.signatarios.map((signatario, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{signatario.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {signatario.cargo} • {signatario.email}
                        </p>
                        {signatario.data_assinatura && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Assinado em {new Date(signatario.data_assinatura).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <Badge className={getSignatureStatusColor(signatario.status)}>
                        {signatario.status === 'assinado' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {signatario.status === 'pendente' && <Clock className="h-3 w-3 mr-1" />}
                        {signatario.status === 'recusado' && <AlertCircle className="h-3 w-3 mr-1" />}
                        <span className="capitalize">{signatario.status}</span>
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum documento encontrado
          </h3>
          <p className="text-muted-foreground">
            Não há documentos com o status selecionado.
          </p>
        </div>
      )}
    </div>
  );
}
