
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useResetUsuarioPassword } from "@/hooks/useUsuarios";
import { Key, Copy, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface ResetSenhaModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName: string;
}

export default function ResetSenhaModal({ 
  isOpen, 
  onClose, 
  userEmail, 
  userName 
}: ResetSenhaModalProps) {
  const [senhaProvisoria, setSenhaProvisoria] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [resetConcluido, setResetConcluido] = useState(false);
  const { toast } = useToast();
  const resetPassword = useResetUsuarioPassword();

  const handleReset = async () => {
    try {
      const response = await resetPassword.mutateAsync(userEmail);
      setSenhaProvisoria(response.senha_provisoria);
      setResetConcluido(true);
      
      toast({
        title: "Reset realizado com sucesso",
        description: `Senha provisória gerada para ${userName}`,
      });
    } catch (error) {
      console.error("Erro no reset:", error);
      toast({
        title: "Erro no reset",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const copiarSenha = () => {
    navigator.clipboard.writeText(senhaProvisoria);
    toast({
      title: "Senha copiada",
      description: "A senha provisória foi copiada para a área de transferência",
    });
  };

  const handleClose = () => {
    setSenhaProvisoria("");
    setResetConcluido(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-orange-600" />
            Reset de Senha
          </DialogTitle>
        </DialogHeader>

        {!resetConcluido ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Input value={userName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userEmail} disabled />
            </div>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-yellow-800 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Atenção
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-yellow-700">
                  Uma senha provisória será gerada. O usuário deverá alterar a senha 
                  no primeiro login.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleReset}
                disabled={resetPassword.isPending}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                {resetPassword.isPending ? "Resetando..." : "Resetar Senha"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Key className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">
                Reset Concluído!
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Senha provisória gerada para {userName}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Senha Provisória</Label>
              <div className="relative">
                <Input
                  type={mostrarSenha ? "text" : "password"}
                  value={senhaProvisoria}
                  readOnly
                  className="pr-20"
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="h-8 w-8 p-0"
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={copiarSenha}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <p className="text-sm text-blue-700">
                  <strong>Importante:</strong> Compartilhe esta senha com o usuário de forma segura. 
                  Ele será obrigado a alterar no primeiro login.
                </p>
              </CardContent>
            </Card>

            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
