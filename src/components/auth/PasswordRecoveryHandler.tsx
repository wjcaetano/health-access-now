
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function PasswordRecoveryHandler() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handlePasswordRecovery = async () => {
      try {
        // Verificar se há tokens de recuperação na URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && accessToken && refreshToken) {
          // Definir a sessão com os tokens de recuperação
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Erro ao definir sessão de recuperação:', error);
            toast({
              variant: "destructive",
              title: "Erro",
              description: "Link de recuperação inválido ou expirado"
            });
            navigate('/login');
          } else {
            toast({
              title: "Link de recuperação validado",
              description: "Agora você pode definir uma nova senha"
            });
            // Redirecionar para a página de troca de senha
            navigate('/troca-senha-obrigatoria');
          }
        }
      } catch (error) {
        console.error('Erro no processamento de recuperação:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao processar link de recuperação"
        });
        navigate('/login');
      }
    };

    handlePasswordRecovery();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-agendaja-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Processando link de recuperação...</p>
      </div>
    </div>
  );
}
