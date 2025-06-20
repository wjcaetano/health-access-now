
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInvites, useRevokeInvite } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Clock, X } from "lucide-react";

export default function ListaConvites() {
  const { data: invites, isLoading } = useInvites();
  const revokeInvite = useRevokeInvite();
  const { toast } = useToast();

  const handleRevokeInvite = async (inviteId: string, email: string) => {
    try {
      await revokeInvite.mutateAsync(inviteId);
      toast({
        title: "Convite revogado",
        description: `Convite para ${email} foi revogado`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível revogar o convite",
        variant: "destructive",
      });
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-32">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Convites Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!invites || invites.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum convite pendente encontrado
            </p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{invite.nome}</h4>
                      <Badge variant="outline">{invite.nivel_acesso}</Badge>
                      {isExpired(invite.expires_at) && (
                        <Badge variant="destructive">Expirado</Badge>
                      )}
                      {invite.used_at && (
                        <Badge variant="secondary">Usado</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{invite.email}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Criado {formatDistanceToNow(new Date(invite.created_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                      <span>
                        Expira em {formatDistanceToNow(new Date(invite.expires_at), { 
                          addSuffix: true, 
                          locale: ptBR 
                        })}
                      </span>
                    </div>
                    {invite.invited_by_user && (
                      <p className="text-xs text-gray-500 mt-1">
                        Convidado por: {invite.invited_by_user.nome}
                      </p>
                    )}
                  </div>
                  {!invite.used_at && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeInvite(invite.id, invite.email)}
                      disabled={revokeInvite.isPending}
                    >
                      <X className="h-4 w-4" />
                      Revogar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
