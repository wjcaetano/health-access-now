
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

const FinanceiroMatriz = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financeiro da Matriz</h1>
        <p className="text-muted-foreground">Gestão financeira da franqueadora</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O módulo financeiro da matriz incluirá:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Controle de receitas e despesas da matriz</li>
            <li>Fluxo de caixa consolidado</li>
            <li>Relatórios financeiros executivos</li>
            <li>Análise de lucratividade por unidade</li>
            <li>Projeções e orçamentos</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroMatriz;
