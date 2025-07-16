
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricasConsolidadas from "@/components/dashboard/franqueadora/MetricasConsolidadas";
import PainelExpansao from "@/components/dashboard/franqueadora/PainelExpansao";
import AlertasExecutivos from "@/components/dashboard/franqueadora/AlertasExecutivos";
import { BarChart3, TrendingUp, MapPin, AlertTriangle } from "lucide-react";

const DashboardFranqueadoraPage = () => {
  const [activeTab, setActiveTab] = useState("metricas");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Executivo</h1>
          <p className="text-muted-foreground">Visão estratégica da rede de franquias</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metricas" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="expansao" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Expansão
          </TabsTrigger>
          <TabsTrigger value="alertas" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metricas">
          <MetricasConsolidadas />
        </TabsContent>

        <TabsContent value="performance">
          <MetricasConsolidadas />
        </TabsContent>

        <TabsContent value="expansao">
          <PainelExpansao />
        </TabsContent>

        <TabsContent value="alertas">
          <AlertasExecutivos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardFranqueadoraPage;
