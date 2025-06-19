
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInvites } from "@/hooks/useInvites";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ListaConvites() {
  const { data: convites, isLoading } = useInvites();

  if (isLoading) {
    return <div className="animate-pulse">Carregando convites...</div>;
  }

  const getStatusBadge = (convite: any) => {
    const now = new Date();
    const expiresAt = new Date(convite.expires_at);
    
    if (convite.used_at) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aceito</Badge>;
    } else if (expiresAt < now) {
      return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expirado</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Convites Enviados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!convites || convites.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum convite enviado ainda</p>
        ) : (
          <div className="space-y-3">
            {convites.map((convite) => (
              <div key={convite.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{convite.nome}</p>
                  <p className="text-sm text-gray-600">{convite.email}</p>
                  <p className="text-xs text-gray-500">
                    Enviado em {format(new Date(convite.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{convite.nivel_acesso}</Badge>
                  {getStatusBadge(convite)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
