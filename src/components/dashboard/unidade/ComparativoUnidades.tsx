
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Trophy, Target, Users, MapPin } from "lucide-react";

const ComparativoUnidades = () => {
  const [periodoComparacao, setPeriodoComparacao] = useState("mes_atual");
  const [metricaSelecionada, setMetricaSelecionada] = useState("faturamento");

  const unidades = [
    {
      id: "atual",
      nome: "Minha Unidade",
      cidade: "São Paulo",
      faturamento: 98500,
      vendas: 156,
      clientes: 1240,
      satisfacao: 4.8,
      meta_atingida: 98.5,
      posicao: 3,
      cor: "#0088FE"
    },
    {
      id: "sp01",
      nome: "SP-01 Centro",
      cidade: "São Paulo",
      faturamento: 125000,
      vendas: 198,
      clientes: 1580,
      satisfacao: 4.9,
      meta_atingida: 125.0,
      posicao: 1,
      cor: "#00C49F"
    },
    {
      id: "rj01", 
      nome: "RJ-01 Copacabana",
      cidade: "Rio de Janeiro",
      faturamento: 110000,
      vendas: 175,
      clientes: 1450,
      satisfacao: 4.7,
      meta_atingida: 110.0,
      posicao: 2,
      cor: "#FFBB28"
    },
    {
      id: "mg01",
      nome: "MG-01 Savassi",
      cidade: "Belo Horizonte", 
      faturamento: 89000,
      vendas: 142,
      clientes: 1180,
      satisfacao: 4.6,
      meta_atingida: 89.0,
      posicao: 4,
      cor: "#FF8042"
    },
    {
      id: "pr01",
      nome: "PR-01 Batel",
      cidade: "Curitiba",
      faturamento: 75000,
      vendas: 120,
      clientes: 980,
      satisfacao: 4.5,
      meta_atingida: 75.0,
      posicao: 5,
      cor: "#8884D8"
    }
  ];

  const dadosRadar = [
    {
      metrica: "Faturamento",
      minhaUnidade: 85,
      media: 90,
      melhor: 100
    },
    {
      metrica: "Vendas",
      minhaUnidade: 88,
      media: 85,
      melhor: 100
    },
    {
      metrica: "Clientes",
      minhaUnidade: 82,
      media: 88,
      melhor: 100
    },
    {
      metrica: "Satisfação",
      minhaUnidade: 96,
      media: 93,
      melhor: 98
    },
    {
      metrica: "Meta",
      minhaUnidade: 99,
      media: 92,
      melhor: 100
    }
  ];

  const getTrendIcon = (posicao: number) => {
    if (posicao <= 2) return <Trophy className="h-4 w-4 text-yellow-600" />;
    if (posicao <= 3) return <TrendingUp className="h-4 w-4 text-green-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const getPosicaoColor = (posicao: number) => {
    if (posicao === 1) return 'bg-yellow-100 text-yellow-800';
    if (posicao <= 3) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Comparativo com Outras Unidades</h2>
          <p className="text-muted-foreground">Performance vs rede de franquias</p>
        </div>
        <div className="flex gap-2">
          <Select value={periodoComparacao} onValueChange={setPeriodoComparacao}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes_atual">Mês Atual</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="semestre">Semestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Definir Metas
          </Button>
        </div>
      </div>

      {/* Posição no Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Sua Posição no Ranking
          </CardTitle>
          <CardDescription>Classificação entre todas as unidades da rede</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg bg-blue-50">
              <div className="text-3xl font-bold text-blue-600">3º</div>
              <p className="text-sm text-muted-foreground">Posição Geral</p>
              <p className="text-xs text-blue-600">de 15 unidades</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <p className="text-sm text-muted-foreground">Meta Atingida</p>
              <p className="text-xs text-green-600">+5% vs média</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{formatCurrency(98500)}</div>
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-xs text-muted-foreground">vs média {formatCurrency(85000)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">4.8</div>
              <p className="text-sm text-muted-foreground">Satisfação</p>
              <p className="text-xs text-yellow-600">Acima da média</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise Radar */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Análise Multidimensional</CardTitle>
            <CardDescription>Comparação em múltiplas métricas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                minhaUnidade: { label: "Minha Unidade", color: "#0088FE" },
                media: { label: "Média da Rede", color: "#00C49F" },
                melhor: { label: "Melhor Unidade", color: "#FFBB28" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dadosRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metrica" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Minha Unidade" 
                    dataKey="minhaUnidade" 
                    stroke="#0088FE" 
                    fill="#0088FE" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Média da Rede" 
                    dataKey="media" 
                    stroke="#00C49F" 
                    fill="#00C49F" 
                    fillOpacity={0.1} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparação por Faturamento</CardTitle>
            <CardDescription>Top 5 unidades da rede</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                faturamento: { label: "Faturamento", color: "#0088FE" }
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unidades} layout="horizontal">
                  <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis type="category" dataKey="nome" width={100} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                    formatter={(value) => [formatCurrency(value as number), 'Faturamento']}
                  />
                  <Bar dataKey="faturamento" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Detalhado */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking Detalhado da Rede</CardTitle>
          <CardDescription>Performance comparativa de todas as métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {unidades.map((unidade) => (
              <div 
                key={unidade.id} 
                className={`p-4 border rounded-lg ${unidade.id === 'atual' ? 'border-blue-300 bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getPosicaoColor(unidade.posicao)} variant="outline">
                        {unidade.posicao}º
                      </Badge>
                      {getTrendIcon(unidade.posicao)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {unidade.nome}
                        {unidade.id === 'atual' && (
                          <Badge variant="secondary">Sua Unidade</Badge>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {unidade.cidade}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Faturamento</p>
                      <p className="font-medium">{formatCurrency(unidade.faturamento)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vendas</p>
                      <p className="font-medium">{unidade.vendas}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clientes</p>
                      <p className="font-medium">{unidade.clientes}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfação</p>
                      <p className="font-medium">⭐ {unidade.satisfacao}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativoUnidades;
