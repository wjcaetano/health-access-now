
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const GestaoRoyalties = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Royalties</h1>
        <p className="text-muted-foreground">Controle de royalties e taxas das franquias</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A gestão de royalties incluirá:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Cálculo automático de royalties</li>
            <li>Controle de pagamentos</li>
            <li>Relatórios de inadimplência</li>
            <li>Integração com sistemas de cobrança</li>
            <li>Dashboard de performance financeira</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestaoRoyalties;
