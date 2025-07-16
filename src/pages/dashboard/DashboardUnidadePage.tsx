
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOperacional from "@/components/dashboard/unidade/DashboardOperacional";
import GestaoEquipe from "@/components/dashboard/unidade/GestaoEquipe";
import ComparativoUnidades from "@/components/dashboard/unidade/ComparativoUnidades";
import { BarChart3, Users, TrendingUp, DollarSign } from "lucide-react";

const DashboardUnidadePage = () => {
  const [activeTab, setActiveTab] = useState("operacional");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard da Unidade</h1>
          <p className="text-muted-foreground">Gestão operacional e performance local</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operacional" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Operacional
          </TabsTrigger>
          <TabsTrigger value="equipe" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Equipe
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Comparativo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operacional">
          <DashboardOperacional />
        </TabsContent>

        <TabsContent value="equipe">
          <GestaoEquipe />
        </TabsContent>

        <TabsContent value="financeiro">
          <DashboardOperacional />
        </TabsContent>

        <TabsContent value="comparativo">
          <ComparativoUnidades />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardUnidadePage;
