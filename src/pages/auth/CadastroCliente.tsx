import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { isValidCPF, isValidEmail, isValidPhone } from '@/lib/validators';

const cadastroClienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  cpf: z.string().refine(isValidCPF, 'CPF inválido'),
  email: z.string().email('Email inválido').refine(isValidEmail, 'Email inválido'),
  telefone: z.string().refine(isValidPhone, 'Telefone inválido'),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmarSenha: z.string()
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha']
});

type CadastroClienteForm = z.infer<typeof cadastroClienteSchema>;

export default function CadastroCliente() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CadastroClienteForm>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CadastroClienteForm, string>>>({});

  const handleChange = (field: keyof CadastroClienteForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validated = cadastroClienteSchema.parse(formData);
      setLoading(true);

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/cliente/dashboard`,
          data: {
            nome: validated.nome,
            cpf: validated.cpf,
            telefone: validated.telefone,
            nivel_acesso: 'cliente'
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Você já pode fazer login e acessar sua conta.',
        variant: 'default'
      });

      // Auto-login se o usuário foi criado
      if (authData.user) {
        navigate('/cliente/dashboard');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CadastroClienteForm, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CadastroClienteForm] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Erro ao cadastrar',
          description: error instanceof Error ? error.message : 'Erro desconhecido',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="w-fit mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <CardTitle>Cadastro de Cliente</CardTitle>
          <CardDescription>
            Crie sua conta para agendar serviços de saúde
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={handleChange('nome')}
                placeholder="João Silva"
                disabled={loading}
              />
              {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome}</p>}
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setFormData(prev => ({ ...prev, cpf: formatted }));
                  setErrors(prev => ({ ...prev, cpf: '' }));
                }}
                placeholder="000.000.000-00"
                maxLength={14}
                disabled={loading}
              />
              {errors.cpf && <p className="text-sm text-destructive mt-1">{errors.cpf}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                placeholder="joao@email.com"
                disabled={loading}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData(prev => ({ ...prev, telefone: formatted }));
                  setErrors(prev => ({ ...prev, telefone: '' }));
                }}
                placeholder="(00) 00000-0000"
                maxLength={15}
                disabled={loading}
              />
              {errors.telefone && <p className="text-sm text-destructive mt-1">{errors.telefone}</p>}
            </div>

            <div>
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange('senha')}
                placeholder="Mínimo 8 caracteres"
                disabled={loading}
              />
              {errors.senha && <p className="text-sm text-destructive mt-1">{errors.senha}</p>}
            </div>

            <div>
              <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange('confirmarSenha')}
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
              {errors.confirmarSenha && (
                <p className="text-sm text-destructive mt-1">{errors.confirmarSenha}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Conta
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => navigate('/login')}
                type="button"
              >
                Fazer login
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
