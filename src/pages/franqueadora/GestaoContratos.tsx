
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const GestaoContratos = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Contratos</h1>
        <p className="text-muted-foreground">Contratos de franquia e documentação legal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A gestão de contratos incluirá:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Biblioteca de modelos de contratos</li>
            <li>Controle de vencimentos</li>
            <li>Assinatura digital integrada</li>
            <li>Histórico de alterações</li>
            <li>Alertas de renovação</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestaoContratos;
