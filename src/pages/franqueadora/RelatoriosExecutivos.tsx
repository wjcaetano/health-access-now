
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

const RelatoriosExecutivos = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios Executivos</h1>
        <p className="text-muted-foreground">Relatórios estratégicos para tomada de decisões</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Os relatórios executivos incluirão:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Dashboards executivos interativos</li>
            <li>Análise de performance por região</li>
            <li>Relatórios de rentabilidade</li>
            <li>Métricas de expansão</li>
            <li>Benchmarking entre unidades</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosExecutivos;
