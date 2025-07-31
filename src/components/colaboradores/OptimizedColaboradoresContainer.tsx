import React, { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CadastroCompleto from "./CadastroCompleto";
import ListaColaboradores from "./ListaColaboradores";
import { UserPlus, Users } from "lucide-react";

const OptimizedColaboradoresContainer = memo(() => {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Gestão de Colaboradores</h1>
      </div>

      <Tabs defaultValue="cadastrar" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-auto">
          <TabsTrigger 
            value="cadastrar" 
            className="flex items-center gap-2 py-3 px-4 text-sm"
          >
            <UserPlus className="h-4 w-4" />
            <span className="whitespace-nowrap">Cadastrar Colaborador</span>
          </TabsTrigger>
          <TabsTrigger 
            value="listar" 
            className="flex items-center gap-2 py-3 px-4 text-sm"
          >
            <Users className="h-4 w-4" />
            <span className="whitespace-nowrap">Listar Colaboradores</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cadastrar">
          <CadastroCompleto />
        </TabsContent>

        <TabsContent value="listar">
          <ListaColaboradores />
        </TabsContent>
      </Tabs>
    </div>
  );
});

OptimizedColaboradoresContainer.displayName = "OptimizedColaboradoresContainer";

export default OptimizedColaboradoresContainer;