
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const ExpansaoFranquias = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Expansão de Franquias</h1>
        <p className="text-muted-foreground">Planejamento estratégico de expansão da rede</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O módulo de expansão incluirá:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Análise de mercado por região</li>
            <li>Mapeamento de oportunidades</li>
            <li>Estudos de viabilidade</li>
            <li>Pipeline de expansão</li>
            <li>Simuladores de investimento</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpansaoFranquias;
