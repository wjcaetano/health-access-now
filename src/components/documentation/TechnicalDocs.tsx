
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Book, 
  Code, 
  Database, 
  Server, 
  Shield, 
  Search,
  FileText,
  GitBranch,
  Layers
} from 'lucide-react';

export default function TechnicalDocs() {
  const [searchTerm, setSearchTerm] = useState('');

  const architectureItems = [
    {
      title: 'Frontend',
      description: 'React + TypeScript + Tailwind CSS',
      icon: <Code className="h-5 w-5" />,
      details: [
        'React 18 com hooks e context',
        'TypeScript para type safety',
        'Tailwind CSS para styling',
        'React Query para estado server',
        'React Router para navegação'
      ]
    },
    {
      title: 'Backend',
      description: 'Supabase + Edge Functions',
      icon: <Server className="h-5 w-5" />,
      details: [
        'Supabase como BaaS',
        'PostgreSQL como banco',
        'Edge Functions para lógica server',
        'Row Level Security (RLS)',
        'Real-time subscriptions'
      ]
    },
    {
      title: 'Segurança',
      description: 'Auth + RLS + Auditoria',
      icon: <Shield className="h-5 w-5" />,
      details: [
        'Autenticação JWT',
        'Row Level Security',
        'Auditoria de acessos',
        'Criptografia de dados',
        'LGPD compliance'
      ]
    },
    {
      title: 'Dados',
      description: 'PostgreSQL + Migrações',
      icon: <Database className="h-5 w-5" />,
      details: [
        'PostgreSQL 15+',
        'Migrações versionadas',
        'Backup automático',
        'Índices otimizados',
        'Views materializadas'
      ]
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      path: '/api/clientes',
      description: 'Lista todos os clientes',
      auth: true,
      params: ['limit', 'offset', 'search']
    },
    {
      method: 'POST',
      path: '/api/clientes',
      description: 'Cria novo cliente',
      auth: true,
      body: ['nome', 'cpf', 'email', 'telefone']
    },
    {
      method: 'GET',
      path: '/api/prestadores',
      description: 'Lista prestadores',
      auth: true,
      params: ['especialidade', 'ativo']
    },
    {
      method: 'POST',
      path: '/api/vendas',
      description: 'Cria nova venda',
      auth: true,
      body: ['cliente_id', 'servicos', 'valor_total']
    }
  ];

  const databaseTables = [
    {
      name: 'clientes',
      description: 'Dados dos clientes/pacientes',
      columns: ['id', 'nome', 'cpf', 'email', 'telefone', 'endereco'],
      relations: ['vendas', 'agendamentos', 'guias']
    },
    {
      name: 'prestadores',
      description: 'Dados dos prestadores de serviço',
      columns: ['id', 'nome', 'tipo', 'especialidades', 'cnpj'],
      relations: ['servicos', 'agendamentos', 'guias']
    },
    {
      name: 'vendas',
      description: 'Registros de vendas realizadas',
      columns: ['id', 'cliente_id', 'valor_total', 'metodo_pagamento'],
      relations: ['clientes', 'vendas_servicos', 'guias']
    },
    {
      name: 'guias',
      description: 'Guias de autorização de serviços',
      columns: ['id', 'codigo_autenticacao', 'status', 'valor'],
      relations: ['clientes', 'prestadores', 'servicos']
    }
  ];

  const deploymentSteps = [
    {
      step: 1,
      title: 'Preparação',
      description: 'Configurar ambiente e dependências',
      commands: [
        'npm install',
        'npm run build',
        'npm run test'
      ]
    },
    {
      step: 2,
      title: 'Banco de Dados',
      description: 'Executar migrações',
      commands: [
        'supabase db push',
        'supabase db seed'
      ]
    },
    {
      step: 3,
      title: 'Deploy',
      description: 'Deploy da aplicação',
      commands: [
        'npm run deploy',
        'npm run verify'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documentação Técnica</h1>
          <p className="text-muted-foreground">Documentação completa do sistema AgendaJá</p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar na documentação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="database">Banco</TabsTrigger>
          <TabsTrigger value="deployment">Deploy</TabsTrigger>
          <TabsTrigger value="guides">Guias</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {architectureItems.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {item.details.map((detail, i) => (
                      <li key={i} className="text-sm">• {detail}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoints da API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm">{endpoint.path}</code>
                      {endpoint.auth && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Auth
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    {endpoint.params && (
                      <div className="text-sm">
                        <strong>Parâmetros:</strong> {endpoint.params.join(', ')}
                      </div>
                    )}
                    {endpoint.body && (
                      <div className="text-sm">
                        <strong>Body:</strong> {endpoint.body.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Esquema do Banco de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {databaseTables.map((table, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4" />
                      <h3 className="font-semibold">{table.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Colunas</h4>
                        <div className="text-sm space-y-1">
                          {table.columns.map((column, i) => (
                            <div key={i} className="font-mono text-xs bg-muted px-2 py-1 rounded">
                              {column}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Relacionamentos</h4>
                        <div className="text-sm space-y-1">
                          {table.relations.map((relation, i) => (
                            <div key={i} className="text-xs text-muted-foreground">
                              → {relation}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processo de Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deploymentSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <div className="space-y-2">
                        {step.commands.map((command, i) => (
                          <div key={i} className="font-mono text-sm bg-muted px-3 py-2 rounded">
                            {command}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Guia de Desenvolvimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Configuração do ambiente</li>
                  <li>• Estrutura do projeto</li>
                  <li>• Padrões de código</li>
                  <li>• Testes e qualidade</li>
                  <li>• Deploy e CI/CD</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Guia de Contribuição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Fluxo de Git</li>
                  <li>• Code review</li>
                  <li>• Padrões de commit</li>
                  <li>• Documentação</li>
                  <li>• Testes obrigatórios</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Guia de Arquitetura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Princípios SOLID</li>
                  <li>• Clean Architecture</li>
                  <li>• Padrões de design</li>
                  <li>• Microserviços</li>
                  <li>• Escalabilidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Guia de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Autenticação e autorização</li>
                  <li>• Criptografia de dados</li>
                  <li>• Auditoria e logs</li>
                  <li>• LGPD compliance</li>
                  <li>• Testes de segurança</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
