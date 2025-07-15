
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email obrigatório",
        description: "Por favor, digite seu email para continuar"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recovery`,
      });

      if (error) {
        console.error('Error sending recovery email:', error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar email",
          description: "Não foi possível enviar o email de recuperação. Tente novamente."
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Email enviado com sucesso!",
          description: "Verifique sua caixa de entrada e spam para instruções de recuperação"
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/recovery`,
      });

      if (!error) {
        toast({
          title: "Email reenviado!",
          description: "Verifique sua caixa de entrada novamente"
        });
      }
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Email enviado!</CardTitle>
          <CardDescription>
            Enviamos as instruções de recuperação para <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Próximos passos:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Verifique sua caixa de entrada</li>
              <li>Clique no link de recuperação</li>
              <li>Defina sua nova senha</li>
            </ol>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Não recebeu o email?
            </p>
            <Button 
              variant="outline" 
              onClick={handleResendEmail}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reenviar email
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={onBackToLogin}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Recuperar senha</CardTitle>
        <CardDescription>
          Digite seu email para receber as instruções de recuperação
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu.email@empresa.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Importante:</strong> Verifique também sua pasta de spam, 
              pois o email pode ser direcionado para lá.
            </p>
          </div>
        </CardContent>
        
        <div className="px-6 pb-6 space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-agendaja-primary hover:bg-agendaja-secondary"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar email de recuperação
          </Button>
          
          <Button 
            type="button"
            variant="ghost" 
            onClick={onBackToLogin}
            disabled={isLoading}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </div>
      </form>
    </Card>
  );
}
