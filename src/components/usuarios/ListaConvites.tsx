
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, AlertCircle } from "lucide-react";

export default function ListaConvites() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Sistema de Convites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sistema de Convites Removido
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              O sistema de convites por email foi removido. Agora os usuários são criados 
              diretamente com senha provisória na aba "Cadastrar Colaborador".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
