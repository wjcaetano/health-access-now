import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Calendar,
  MapPin,
  DollarSign
} from "lucide-react";
import { LeadFranqueado } from "@/hooks/useFranqueadora";

interface ConversionReportsProps {
  leads: LeadFranqueado[];
}

export const ConversionReports = ({ leads }: ConversionReportsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Dados do funil de conversão - fixed to handle string status type
  const funnelData = [
    { name: 'Novos Leads', value: leads.filter(l => l.status === 'novo').length, color: '#3b82f6' },
    { name: 'Contatados', value: leads.filter(l => l.status === 'contatado').length, color: '#8b5cf6' },
    { name: 'Qualificados', value: leads.filter(l => l.status === 'qualificado').length, color: '#eab308' },
    { name: 'Proposta', value: leads.filter(l => l.status === 'proposta').length, color: '#f97316' },
    { name: 'Negociação', value: leads.filter(l => l.status === 'negociacao').length, color: '#6366f1' },
    { name: 'Aprovados', value: leads.filter(l => l.status === 'aprovado').length, color: '#10b981' }
  ];

  // Conversão por origem
  const origemData = ['site', 'indicacao', 'google', 'facebook', 'feira', 'outros'].map(origem => {
    const totalOrigin = leads.filter(l => l.origem === origem).length;
    const approvedOrigin = leads.filter(l => l.origem === origem && l.status === 'aprovado').length;
    return {
      origem,
      total: totalOrigin,
      aprovados: approvedOrigin,
      conversao: totalOrigin > 0 ? Math.round((approvedOrigin / totalOrigin) * 100) : 0
    };
  });

  // Conversão por período (simulado)
  const periodData = [
    { mes: 'Jan', leads: 45, conversoes: 8, taxa: 18 },
    { mes: 'Fev', leads: 52, conversoes: 12, taxa: 23 },
    { mes: 'Mar', leads: 38, conversoes: 9, taxa: 24 },
    { mes: 'Abr', leads: 61, conversoes: 15, taxa: 25 },
    { mes: 'Mai', leads: 47, conversoes: 14, taxa: 30 },
    { mes: 'Jun', leads: 55, conversoes: 18, taxa: 33 }
  ];

  // Conversão por região
  const regiaoData = ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Paraná', 'Santa Catarina'].map(estado => {
    const totalRegiao = leads.filter(l => l.estado_interesse === estado || l.cidade_interesse?.includes(estado)).length;
    const approvedRegiao = leads.filter(l => 
      (l.estado_interesse === estado || l.cidade_interesse?.includes(estado)) && l.status === 'aprovado'
    ).length;
    return {
      regiao: estado,
      total: totalRegiao,
      aprovados: approvedRegiao,
      conversao: totalRegiao > 0 ? Math.round((approvedRegiao / totalRegiao) * 100) : 0
    };
  });

  const totalLeads = leads.length;
  const totalAprovados = leads.filter(l => l.status === 'aprovado').length;
  const taxaConversaoGeral = totalLeads > 0 ? Math.round((totalAprovados / totalLeads) * 100) : 0;

  const COLORS = ['#3b82f6', '#8b5cf6', '#eab308', '#f97316', '#6366f1', '#10b981'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios de Conversão</CardTitle>
          <CardDescription>
            Análise detalhada das taxas de conversão e performance do funil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{totalLeads}</div>
              <div className="text-sm text-muted-foreground">Total de Leads</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalAprovados}</div>
              <div className="text-sm text-muted-foreground">Convertidos</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{taxaConversaoGeral}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">R$ 2.8M</div>
              <div className="text-sm text-muted-foreground">Valor Potencial</div>
            </div>
          </div>

          <Tabs defaultValue="funil" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="funil">Funil de Conversão</TabsTrigger>
              <TabsTrigger value="origem">Por Origem</TabsTrigger>
              <TabsTrigger value="periodo">Por Período</TabsTrigger>
              <TabsTrigger value="regiao">Por Região</TabsTrigger>
            </TabsList>

            <TabsContent value="funil" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Funil de Vendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={funnelData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Taxa de Conversão por Etapa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {funnelData.map((stage, index) => {
                        const nextStage = funnelData[index + 1];
                        const conversionRate = nextStage 
                          ? Math.round((nextStage.value / stage.value) * 100) 
                          : 0;
                        
                        return index < funnelData.length - 1 ? (
                          <div key={stage.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{stage.name} → {nextStage?.name}</span>
                              <Badge variant="outline">{conversionRate}%</Badge>
                            </div>
                            <Progress value={conversionRate} className="h-2" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="origem" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversão por Origem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={origemData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="origem" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="conversao" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance por Canal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {origemData.map((origem) => (
                        <div key={origem.origem} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <div className="font-medium capitalize">{origem.origem}</div>
                            <div className="text-sm text-muted-foreground">
                              {origem.aprovados}/{origem.total} leads
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{origem.conversao}%</div>
                            <Badge variant={origem.conversao >= 25 ? "default" : "secondary"}>
                              {origem.conversao >= 25 ? "Excelente" : "Melhorar"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="periodo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Evolução da Taxa de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={periodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="taxa" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regiao" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conversão por Região</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={regiaoData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ regiao, conversao }) => `${regiao}: ${conversao}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="conversao"
                        >
                          {regiaoData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ranking por Estado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {regiaoData
                        .sort((a, b) => b.conversao - a.conversao)
                        .map((regiao, index) => (
                          <div key={regiao.regiao} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{regiao.regiao}</div>
                              <div className="text-sm text-muted-foreground">
                                {regiao.total} leads • {regiao.aprovados} conversões
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{regiao.conversao}%</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
