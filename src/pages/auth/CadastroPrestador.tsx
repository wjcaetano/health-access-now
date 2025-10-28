import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { isValidCPF, isValidCNPJ, isValidEmail, isValidPhone } from '@/lib/validators';

const cadastroPrestadorSchema = z.object({
  tipo: z.enum(['pf', 'pj']),
  nome: z.string().min(3).max(100),
  documento: z.string(),
  email: z.string().email(),
  telefone: z.string(),
  especialidades: z.string().min(10, 'Descreva suas especialidades'),
  senha: z.string().min(8),
  confirmarSenha: z.string(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional()
}).refine(data => {
  if (data.tipo === 'pf') return isValidCPF(data.documento);
  return isValidCNPJ(data.documento);
}, {
  message: 'Documento inválido',
  path: ['documento']
}).refine(data => isValidEmail(data.email), {
  message: 'Email inválido',
  path: ['email']
}).refine(data => isValidPhone(data.telefone), {
  message: 'Telefone inválido',
  path: ['telefone']
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não conferem',
  path: ['confirmarSenha']
});

type CadastroPrestadorForm = z.infer<typeof cadastroPrestadorSchema>;

const STEPS = [
  { id: 1, title: 'Tipo' },
  { id: 2, title: 'Dados Pessoais' },
  { id: 3, title: 'Especialidades' },
  { id: 4, title: 'Dados Bancários' },
  { id: 5, title: 'Confirmação' }
];

export default function CadastroPrestador() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CadastroPrestadorForm>({
    tipo: 'pf',
    nome: '',
    documento: '',
    email: '',
    telefone: '',
    especialidades: '',
    senha: '',
    confirmarSenha: '',
    banco: '',
    agencia: '',
    conta: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CadastroPrestadorForm, string>>>({});

  const handleChange = (field: keyof CadastroPrestadorForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = (step: number): boolean => {
    try {
      if (step === 1) {
        z.object({ tipo: z.enum(['pf', 'pj']) }).parse({ tipo: formData.tipo });
      } else if (step === 2) {
        const schema = z.object({
          nome: z.string().min(3),
          documento: z.string(),
          email: z.string().email(),
          telefone: z.string(),
          senha: z.string().min(8),
          confirmarSenha: z.string()
        });
        schema.parse({
          nome: formData.nome,
          documento: formData.documento,
          email: formData.email,
          telefone: formData.telefone,
          senha: formData.senha,
          confirmarSenha: formData.confirmarSenha
        });
        
        if (formData.tipo === 'pf' && !isValidCPF(formData.documento)) {
          throw new Error('CPF inválido');
        }
        if (formData.tipo === 'pj' && !isValidCNPJ(formData.documento)) {
          throw new Error('CNPJ inválido');
        }
        if (formData.senha !== formData.confirmarSenha) {
          throw new Error('As senhas não conferem');
        }
      } else if (step === 3) {
        z.object({ especialidades: z.string().min(10) }).parse({ especialidades: formData.especialidades });
      }
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: 'Erro de validação',
          description: error.message,
          variant: 'destructive'
        });
      }
      return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setErrors({});
    
    try {
      const validated = cadastroPrestadorSchema.parse(formData);
      setLoading(true);

      // Criar usuário com status aguardando_aprovacao
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validated.email,
        password: validated.senha,
        options: {
          emailRedirectTo: `${window.location.origin}/prestador/portal`,
          data: {
            nome: validated.nome,
            documento: validated.documento,
            telefone: validated.telefone,
            tipo: validated.tipo,
            especialidades: validated.especialidades,
            nivel_acesso: 'prestador',
            status: 'aguardando_aprovacao'
          }
        }
      });

      if (authError) throw authError;

      // Notificar admins (isso será feito via trigger no banco)
      toast({
        title: 'Cadastro enviado com sucesso!',
        description: 'Seu cadastro está em análise. Você receberá um email quando for aprovado.',
        variant: 'default'
      });

      navigate('/login');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CadastroPrestadorForm, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CadastroPrestadorForm] = err.message;
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

  const formatDocument = (value: string, tipo: 'pf' | 'pj') => {
    const cleaned = value.replace(/\D/g, '');
    if (tipo === 'pf') {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      return cleaned
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
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
          <CardTitle>Cadastro de Prestador</CardTitle>
          <CardDescription>
            Complete seu cadastro para oferecer seus serviços
          </CardDescription>

          {/* Stepper */}
          <div className="flex items-center justify-between mt-6">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1: Tipo */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label>Tipo de Cadastro *</Label>
                <RadioGroup
                  value={formData.tipo}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value as 'pf' | 'pj' }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pf" id="pf" />
                    <Label htmlFor="pf" className="font-normal cursor-pointer">
                      Pessoa Física (Profissional Autônomo)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pj" id="pj" />
                    <Label htmlFor="pj" className="font-normal cursor-pointer">
                      Pessoa Jurídica (Clínica/Laboratório)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Dados Pessoais */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">
                    {formData.tipo === 'pf' ? 'Nome Completo' : 'Razão Social'} *
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={handleChange('nome')}
                    placeholder={formData.tipo === 'pf' ? 'Dr. João Silva' : 'Clínica Exemplo LTDA'}
                  />
                  {errors.nome && <p className="text-sm text-destructive mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <Label htmlFor="documento">
                    {formData.tipo === 'pf' ? 'CPF' : 'CNPJ'} *
                  </Label>
                  <Input
                    id="documento"
                    value={formData.documento}
                    onChange={(e) => {
                      const formatted = formatDocument(e.target.value, formData.tipo);
                      setFormData(prev => ({ ...prev, documento: formatted }));
                      setErrors(prev => ({ ...prev, documento: '' }));
                    }}
                    placeholder={formData.tipo === 'pf' ? '000.000.000-00' : '00.000.000/0000-00'}
                    maxLength={formData.tipo === 'pf' ? 14 : 18}
                  />
                  {errors.documento && <p className="text-sm text-destructive mt-1">{errors.documento}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="contato@exemplo.com"
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={handleChange('telefone')}
                    placeholder="(00) 00000-0000"
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
                  />
                  {errors.confirmarSenha && (
                    <p className="text-sm text-destructive mt-1">{errors.confirmarSenha}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Especialidades */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="especialidades">Especialidades e Áreas de Atuação *</Label>
                  <Textarea
                    id="especialidades"
                    value={formData.especialidades}
                    onChange={handleChange('especialidades')}
                    placeholder="Descreva suas especialidades, áreas de atuação, certificações, etc."
                    rows={6}
                  />
                  {errors.especialidades && (
                    <p className="text-sm text-destructive mt-1">{errors.especialidades}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    Mínimo de 10 caracteres
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Dados Bancários */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Dados bancários para recebimento de pagamentos (opcional neste momento)
                </p>
                <div>
                  <Label htmlFor="banco">Banco</Label>
                  <Input
                    id="banco"
                    value={formData.banco}
                    onChange={handleChange('banco')}
                    placeholder="Nome do banco"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agencia">Agência</Label>
                    <Input
                      id="agencia"
                      value={formData.agencia}
                      onChange={handleChange('agencia')}
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conta">Conta</Label>
                    <Input
                      id="conta"
                      value={formData.conta}
                      onChange={handleChange('conta')}
                      placeholder="00000-0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmação */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">Resumo do Cadastro</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Tipo:</strong> {formData.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                    <p><strong>Nome:</strong> {formData.nome}</p>
                    <p><strong>Documento:</strong> {formData.documento}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Telefone:</strong> {formData.telefone}</p>
                    <p><strong>Especialidades:</strong> {formData.especialidades}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ao confirmar, seu cadastro será enviado para análise. Você receberá um email quando
                  for aprovado e poderá acessar o sistema.
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              {currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep} disabled={loading}>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar Cadastro
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
