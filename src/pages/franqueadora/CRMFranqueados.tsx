
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Filter, Search } from "lucide-react";

const CRMFranqueados = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM de Franqueados</h1>
          <p className="text-muted-foreground">Gerencie relacionamento com franqueados ativos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Franqueado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Em Desenvolvimento
          </CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            O CRM de Franqueados incluirá funcionalidades como:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
            <li>Gestão completa de franqueados</li>
            <li>Histórico de relacionamento</li>
            <li>Comunicação integrada</li>
            <li>Acompanhamento de performance</li>
            <li>Relatórios personalizados</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMFranqueados;
