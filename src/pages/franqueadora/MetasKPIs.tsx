
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const MetasKPIs = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Metas & KPIs</h1>
        <p className="text-muted-foreground">Acompanhamento de metas e indicadores de performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O módulo de metas e KPIs incluirá:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Definição de metas por unidade</li>
            <li>Acompanhamento de KPIs em tempo real</li>
            <li>Alertas de performance</li>
            <li>Gamificação e rankings</li>
            <li>Relatórios de cumprimento de metas</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetasKPIs;
