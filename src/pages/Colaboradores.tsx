
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import CadastroCompleto from "@/components/colaboradores/CadastroCompleto";
import ListaColaboradores from "@/components/colaboradores/ListaColaboradores";
import { UserPlus, Users } from "lucide-react";

export default function ColaboradoresPage() {
  return (
    <ProtectedRoute requiredLevel="gerente">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão de Colaboradores</h1>
        </div>

        <Tabs defaultValue="cadastrar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cadastrar" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Cadastrar Colaborador
            </TabsTrigger>
            <TabsTrigger value="listar" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Listar Colaboradores
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
    </ProtectedRoute>
  );
}
