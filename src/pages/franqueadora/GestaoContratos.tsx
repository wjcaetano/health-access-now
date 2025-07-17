
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, PenTool, History, AlertTriangle } from "lucide-react";
import ContractsLibrary from "@/components/franqueadora/contratos/ContractsLibrary";
import ExpirationControl from "@/components/franqueadora/contratos/ExpirationControl";
import DigitalSignature from "@/components/franqueadora/contratos/DigitalSignature";
import ChangeHistory from "@/components/franqueadora/contratos/ChangeHistory";

const GestaoContratos = () => {
  const [activeTab, setActiveTab] = useState("biblioteca");

  // Mock data for overview stats
  const stats = {
    totalContratos: 45,
    contratosAtivos: 38,
    vencendoEm30Dias: 5,
    pendentesAssinatura: 3,
    alteracoesPendentes: 2
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Contratos</h1>
        <p className="text-muted-foreground">Contratos de franquia e documentação legal</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Contratos</p>
                <p className="text-2xl font-bold">{stats.totalContratos}</p>
              </div>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contratos Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.contratosAtivos}</p>
              </div>
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-800">Vencendo em 30 dias</p>
                <p className="text-2xl font-bold text-orange-900">{stats.vencendoEm30Dias}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Pendentes Assinatura</p>
                <p className="text-2xl font-bold text-blue-900">{stats.pendentesAssinatura}</p>
              </div>
              <PenTool className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Alterações Pendentes</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.alteracoesPendentes}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="biblioteca" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Biblioteca de Modelos
          </TabsTrigger>
          <TabsTrigger value="vencimentos" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Controle de Vencimentos
          </TabsTrigger>
          <TabsTrigger value="assinatura" className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Assinatura Digital
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico de Alterações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="biblioteca">
          <Card>
            <CardContent className="p-6">
              <ContractsLibrary />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vencimentos">
          <Card>
            <CardContent className="p-6">
              <ExpirationControl />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assinatura">
          <Card>
            <CardContent className="p-6">
              <DigitalSignature />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardContent className="p-6">
              <ChangeHistory />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestaoContratos;
