
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Target,
  TrendingUp,
  Code,
  TestTube,
  Shield,
  Zap
} from 'lucide-react';

interface QualityMetrics {
  testCoverage: number;
  codeQuality: number;
  performance: number;
  security: number;
  accessibility: number;
}

interface TestResult {
  suite: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

export default function QualityDashboard() {
  const [metrics] = useState<QualityMetrics>({
    testCoverage: 85,
    codeQuality: 92,
    performance: 88,
    security: 96,
    accessibility: 78,
  });

  const [testResults] = useState<TestResult[]>([
    {
      suite: 'Unit Tests',
      total: 156,
      passed: 148,
      failed: 6,
      skipped: 2,
      duration: 12.5,
    },
    {
      suite: 'Integration Tests',
      total: 45,
      passed: 42,
      failed: 2,
      skipped: 1,
      duration: 45.2,
    },
    {
      suite: 'E2E Tests',
      total: 28,
      passed: 25,
      failed: 3,
      skipped: 0,
      duration: 180.7,
    },
  ]);

  const [codeIssues] = useState([
    {
      type: 'error',
      file: 'src/components/vendas/VendasContainer.tsx',
      line: 45,
      message: 'Unused variable "tempData"',
      severity: 'medium',
    },
    {
      type: 'warning',
      file: 'src/hooks/useVendas.ts',
      line: 123,
      message: 'Console.log found',
      severity: 'low',
    },
    {
      type: 'error',
      file: 'src/utils/formatters.ts',
      line: 78,
      message: 'Potential null pointer exception',
      severity: 'high',
    },
  ]);

  const [performanceMetrics] = useState([
    {
      metric: 'First Contentful Paint',
      value: '1.2s',
      target: '< 1.5s',
      status: 'good',
    },
    {
      metric: 'Largest Contentful Paint',
      value: '2.8s',
      target: '< 2.5s',
      status: 'warning',
    },
    {
      metric: 'Cumulative Layout Shift',
      value: '0.05',
      target: '< 0.1',
      status: 'good',
    },
    {
      metric: 'Time to Interactive',
      value: '3.2s',
      target: '< 3.0s',
      status: 'warning',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="outline">Média</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="default">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Qualidade</h1>
          <p className="text-muted-foreground">Métricas de qualidade, testes e performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TestTube className="h-4 w-4 mr-2" />
            Executar Testes
          </Button>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura de Testes</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.testCoverage}%</div>
            <Progress value={metrics.testCoverage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualidade do Código</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.codeQuality}%</div>
            <Progress value={metrics.codeQuality} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance}%</div>
            <Progress value={metrics.performance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Segurança</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.security}%</div>
            <Progress value={metrics.security} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acessibilidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.accessibility}%</div>
            <Progress value={metrics.accessibility} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tests">Testes</TabsTrigger>
          <TabsTrigger value="code">Código</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{result.suite}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total:</span>
                      <span className="font-medium">{result.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Passou:</span>
                      <span className="font-medium text-green-600">{result.passed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-red-600">Falhou:</span>
                      <span className="font-medium text-red-600">{result.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-yellow-600">Pulou:</span>
                      <span className="font-medium text-yellow-600">{result.skipped}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duração:</span>
                      <span className="font-medium">{result.duration}s</span>
                    </div>
                    <Progress 
                      value={(result.passed / result.total) * 100} 
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problemas de Código</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {codeIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getStatusIcon(issue.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono">{issue.file}:{issue.line}</code>
                        {getSeverityBadge(issue.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{issue.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <div className="font-medium">{metric.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          Target: {metric.target}
                        </div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Vulnerabilidades</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Nenhuma vulnerabilidade crítica encontrada
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Dependências</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Todas as dependências atualizadas
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Autenticação</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      JWT e RLS implementados
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">LGPD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Compliance implementado
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
