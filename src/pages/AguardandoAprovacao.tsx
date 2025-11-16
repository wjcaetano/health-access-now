import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AguardandoAprovacao() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-fit">
            <Clock className="h-12 w-12 text-yellow-600 dark:text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Cadastro em Análise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Olá <strong>{profile?.nome}</strong>, seu cadastro está em análise pela nossa equipe.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Próximos Passos
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
              <li>Analisaremos suas informações em até 24 horas úteis</li>
              <li>Você receberá um email quando seu cadastro for aprovado</li>
              <li>Após aprovação, você poderá acessar o sistema normalmente</li>
            </ul>
          </div>

          <div className="bg-muted border rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Informações do Cadastro
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Status:</strong> <span className="text-yellow-600 dark:text-yellow-500">Aguardando Aprovação</span></p>
            </div>
          </div>

          <div className="pt-4 border-t space-y-2">
            <p className="text-xs text-muted-foreground">
              Precisa de ajuda? Entre em contato com nosso suporte.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              Sair da Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
