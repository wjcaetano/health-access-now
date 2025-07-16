
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Target, Users, TrendingUp, Plus, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

const PainelExpansao = () => {
  const [selectedRegion, setSelectedRegion] = useState("todos");

  const territorios = [
    {
      id: 1,
      cidade: "Belo Horizonte",
      estado: "MG",
      populacao: 2500000,
      potencial: "Alto",
      investimento: 180000,
      roi_projetado: 24,
      status: "disponivel",
      leads: 3
    },
    {
      id: 2,
      cidade: "Curitiba",
      estado: "PR",
      populacao: 1900000,
      potencial: "Médio",
      investimento: 160000,
      roi_projetado: 22,
      status: "em_analise",
      leads: 2
    },
    {
      id: 3,
      cidade: "Salvador",
      estado: "BA",
      populacao: 2800000,
      potencial: "Alto",
      investimento: 170000,
      roi_projetado: 26,
      status: "reservado",
      leads: 1
    },
    {
      id: 4,
      cidade: "Fortaleza",
      estado: "CE",
      populacao: 2600000,
      potencial: "Médio",
      investimento: 155000,
      roi_projetado: 20,
      status: "disponivel",
      leads: 4
    }
  ];

  const metas = [
    {
      periodo: "2024 Q4",
      novasFranquias: 5,
      atingidas: 3,
      receita: 850000,
      meta_receita: 1000000
    },
    {
      periodo: "2025 Q1",
      novasFranquias: 8,
      atingidas: 0,
      receita: 0,
      meta_receita: 1200000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'reservado': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPotencialColor = (potencial: string) => {
    switch (potencial) {
      case 'Alto': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Baixo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Expansão Territorial</h2>
          <p className="text-muted-foreground">Gestão de territórios e metas de expansão</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Território
        </Button>
      </div>

      <Tabs value={selectedRegion} onValueChange={setSelectedRegion}>
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="sudeste">Sudeste</TabsTrigger>
          <TabsTrigger value="sul">Sul</TabsTrigger>
          <TabsTrigger value="nordeste">Nordeste</TabsTrigger>
          <TabsTrigger value="norte">Norte</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {/* Metas de Expansão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Metas de Expansão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {metas.map((meta, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{meta.periodo}</h4>
                      <Badge variant="outline">
                        {meta.atingidas}/{meta.novasFranquias} franquias
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Receita Meta:</span>
                        <span className="font-medium">{formatCurrency(meta.meta_receita)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Receita Atual:</span>
                        <span className="font-medium">{formatCurrency(meta.receita)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(meta.atingidas / meta.novasFranquias) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Territórios Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Territórios Disponíveis
              </CardTitle>
              <CardDescription>
                Oportunidades de expansão ordenadas por potencial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {territorios.map((territorio) => (
                  <div key={territorio.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-lg">
                            {territorio.cidade}/{territorio.estado}
                          </h4>
                          <Badge className={getStatusColor(territorio.status)} variant="outline">
                            {territorio.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPotencialColor(territorio.potencial)} variant="outline">
                            {territorio.potencial}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">População:</span>
                            <p className="font-medium">{territorio.populacao.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Investimento:</span>
                            <p className="font-medium">{formatCurrency(territorio.investimento)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ROI Projetado:</span>
                            <p className="font-medium text-green-600">{territorio.roi_projetado}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Leads Interessados:</span>
                            <p className="font-medium">{territorio.leads}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        {territorio.status === 'disponivel' && (
                          <Button size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            Ver Leads
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PainelExpansao;
