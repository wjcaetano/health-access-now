
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PasswordRecoveryHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      try {
        console.log('Starting password recovery process...');
        
        // Verificar se há tokens de recuperação na URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        console.log('Recovery parameters:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken, error });

        // Verificar se há erro na URL
        if (error) {
          console.error('Recovery URL contains error:', error, errorDescription);
          setStatus('error');
          setErrorMessage(errorDescription || 'Link de recuperação inválido');
          toast({
            variant: "destructive",
            title: "Erro no link de recuperação",
            description: errorDescription || "Link de recuperação inválido ou expirado"
          });
          return;
        }

        if (type === 'recovery' && accessToken && refreshToken) {
          console.log('Setting recovery session...');
          
          // Definir a sessão com os tokens de recuperação
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error('Erro ao definir sessão de recuperação:', sessionError);
            setStatus('error');
            setErrorMessage('Link de recuperação inválido ou expirado');
            toast({
              variant: "destructive",
              title: "Erro",
              description: "Link de recuperação inválido ou expirado"
            });
          } else {
            console.log('Recovery session set successfully:', data);
            setStatus('success');
            toast({
              title: "Link de recuperação validado",
              description: "Agora você pode definir uma nova senha"
            });
            
            // Redirecionar para a página de troca de senha após um breve delay
            setTimeout(() => {
              navigate('/troca-senha-obrigatoria', { replace: true });
            }, 2000);
          }
        } else {
          console.error('Missing recovery parameters:', { type, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
          setStatus('error');
          setErrorMessage('Link de recuperação incompleto ou inválido');
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Link de recuperação incompleto ou inválido"
          });
        }
      } catch (error) {
        console.error('Erro no processamento de recuperação:', error);
        setStatus('error');
        setErrorMessage('Erro ao processar link de recuperação');
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao processar link de recuperação"
        });
      }
    };

    handlePasswordRecovery();
  }, [navigate, toast]);

  const handleGoToLogin = () => {
    navigate('/login', { replace: true });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </h1>
            <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <CardTitle>Processando recuperação...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Aguarde enquanto validamos seu link de recuperação de senha.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-agendaja-primary">
              AGENDA<span className="text-agendaja-secondary">JA</span>
            </h1>
            <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Link validado com sucesso!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Seu link de recuperação foi validado. Você será redirecionado para 
                definir sua nova senha em instantes.
              </p>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Redirecionando...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-agendaja-primary">
            AGENDA<span className="text-agendaja-secondary">JA</span>
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Agendamento de Saúde</p>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-red-700">Erro na recuperação</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {errorMessage || 'Não foi possível processar seu link de recuperação de senha.'}
            </p>
            
            <div className="p-3 bg-amber-50 rounded-lg text-left">
              <p className="text-sm text-amber-800">
                <strong>Possíveis causas:</strong>
              </p>
              <ul className="text-sm text-amber-800 mt-1 space-y-1 list-disc list-inside">
                <li>Link expirado (válido por 1 hora)</li>
                <li>Link já foi utilizado</li>
                <li>Link incompleto ou corrompido</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleGoToLogin}
              className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
            >
              Voltar ao login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
