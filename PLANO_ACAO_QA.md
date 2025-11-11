# 🚀 PLANO DE AÇÃO - CORREÇÃO DE BUGS E MELHORIAS

**Baseado em:** RELATORIO_QA_COMPLETO.md
**Prioridade:** CRÍTICO → ALTO → MÉDIO
**Tempo Total Estimado:** 10-15 dias úteis

---

## 📋 ÍNDICE
1. [FASE CRÍTICA (BLOQUEADORES)](#fase-crítica-bloqueadores)
2. [FASE ALTA PRIORIDADE](#fase-alta-prioridade)
3. [FASE MÉDIA PRIORIDADE](#fase-média-prioridade)
4. [FASE BAIXA PRIORIDADE (OPCIONAL)](#fase-baixa-prioridade-opcional)

---

# 🔴 FASE CRÍTICA (BLOQUEADORES)

## **Prazo:** 3-5 dias úteis
## **Prioridade:** MÁXIMA - SISTEMA NÃO FUNCIONA SEM ISSO

---

## ✅ TAREFA 1: Implementar Sistema Completo de Aprovação de Prestadores
**BUG:** #010 - CRÍTICO
**Tempo Estimado:** 8 horas
**Prioridade:** 🔴 BLOQUEADOR

### **Descrição do Problema:**
- Página `/approvals` existe mas não lista prestadores pendentes
- Admins não conseguem aprovar prestadores cadastrados
- Todo o fluxo de prestador está bloqueado

### **Passos de Implementação:**

#### **1.1. Criar Query para Buscar Prestadores Pendentes (1h)**
**Arquivo:** `src/hooks/useAprovacoes.ts` (criar)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function usePrestadoresPendentes() {
  return useQuery({
    queryKey: ['prestadores-pendentes'],
    queryFn: async () => {
      // Buscar prestadores com status 'aguardando_aprovacao' nos profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          nome,
          status,
          prestador_id,
          created_at,
          prestadores:prestadores (
            id,
            nome,
            tipo,
            cnpj,
            especialidades,
            telefone,
            email
          )
        `)
        .eq('nivel_acesso', 'prestador')
        .eq('status', 'aguardando_aprovacao')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      return profiles;
    },
    staleTime: 30 * 1000, // 30 segundos (atualizar frequentemente)
  });
}

export function useAprovarPrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prestadorId: string) => {
      // Atualizar status do profile para 'ativo'
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'ativo' })
        .eq('id', prestadorId);

      if (error) throw error;

      // TODO: Enviar email de aprovação (edge function)
      // await supabase.functions.invoke('send-email', {
      //   body: { tipo: 'aprovacao-prestador', destinatario: email }
      // });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador aprovado!',
        description: 'O prestador foi aprovado e pode acessar o sistema.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao aprovar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useReprovarPrestador() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ prestadorId, motivo }: { prestadorId: string; motivo: string }) => {
      // Atualizar status para 'inativo' (reprovado)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: 'inativo',
          // Armazenar motivo em JSONB metadata (criar campo se necessário)
        })
        .eq('id', prestadorId);

      if (error) throw error;

      // TODO: Enviar email de reprovação
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prestadores-pendentes'] });
      toast({
        title: 'Prestador reprovado',
        description: 'O cadastro foi reprovado e o prestador foi notificado.',
      });
    },
  });
}
```

---

#### **1.2. Criar Página de Aprovações (2h)**
**Arquivo:** `src/pages/AprovacoesPage.tsx` (modificar)

```tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, FileText, Mail, Phone } from 'lucide-react';
import { usePrestadoresPendentes, useAprovarPrestador, useReprovarPrestador } from '@/hooks/useAprovacoes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AprovacoesPage() {
  const { data: pendentes, isLoading } = usePrestadoresPendentes();
  const aprovar = useAprovarPrestador();
  const reprovar = useReprovarPrestador();

  const [selectedPrestador, setSelectedPrestador] = useState<any>(null);
  const [showReprovarDialog, setShowReprovarDialog] = useState(false);
  const [motivoReprovacao, setMotivoReprovacao] = useState('');

  const handleAprovar = (prestador: any) => {
    if (confirm(`Aprovar cadastro de ${prestador.nome}?`)) {
      aprovar.mutate(prestador.id);
    }
  };

  const handleReprovar = () => {
    if (!motivoReprovacao.trim()) {
      alert('Digite o motivo da reprovação');
      return;
    }
    reprovar.mutate({
      prestadorId: selectedPrestador.id,
      motivo: motivoReprovacao,
    });
    setShowReprovarDialog(false);
    setMotivoReprovacao('');
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
        <p className="text-muted-foreground">Gerencie solicitações de cadastro de prestadores</p>
      </div>

      {pendentes?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma aprovação pendente
              </h3>
              <p className="text-gray-500">
                Todas as solicitações foram processadas.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendentes?.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile.nome}
                      <Badge variant="secondary">
                        {profile.prestadores?.tipo === 'pf' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Cadastrado em {format(new Date(profile.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Aguardando Aprovação
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.prestadores?.telefone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.prestadores?.cnpj || 'CPF não exibido'}</span>
                  </div>
                </div>

                {profile.prestadores?.especialidades && (
                  <div>
                    <Label className="text-sm font-medium">Especialidades</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {Array.isArray(profile.prestadores.especialidades)
                        ? profile.prestadores.especialidades.join(', ')
                        : profile.prestadores.especialidades}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => handleAprovar(profile)}
                    disabled={aprovar.isPending}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPrestador(profile);
                      setShowReprovarDialog(true);
                    }}
                    disabled={reprovar.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de Reprovação */}
      <Dialog open={showReprovarDialog} onOpenChange={setShowReprovarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Cadastro</DialogTitle>
            <DialogDescription>
              Informe o motivo da reprovação. O prestador será notificado por email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da Reprovação *</Label>
              <Textarea
                id="motivo"
                value={motivoReprovacao}
                onChange={(e) => setMotivoReprovacao(e.target.value)}
                placeholder="Ex: Documentação incompleta, dados inválidos, etc."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReprovarDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReprovar}>
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

#### **1.3. Testar Fluxo Completo (1h)**

**Checklist de Testes:**
- [ ] Admin acessa `/approvals` e vê lista de prestadores pendentes
- [ ] Clicar em "Aprovar" muda status do prestador para "ativo"
- [ ] Prestador aprovado consegue fazer login
- [ ] Clicar em "Reprovar" abre dialog de motivo
- [ ] Prestador reprovado recebe email (se implementado)

---

## ✅ TAREFA 2: Corrigir Autenticação de Prestadores "Aguardando Aprovação"
**BUG:** #009 - CRÍTICO
**Tempo Estimado:** 4 horas
**Prioridade:** 🔴 CRÍTICO

### **Descrição do Problema:**
- Prestadores com `status: 'aguardando_aprovacao'` não conseguem fazer login
- AuthContext bloqueia acesso baseado em `profile.status === 'ativo'`
- Prestador cadastrado fica sem acesso ao sistema

### **Solução:**
Criar tela de "Aguardando Aprovação" em vez de bloquear login completamente

---

#### **2.1. Modificar AuthContext (1h)**
**Arquivo:** `src/contexts/AuthContext.tsx`

```typescript
// Remover verificação que bloqueia login:
// if (profile.status !== 'ativo') return null;

// Permitir login para todos os status, mas redirecionar conforme status
```

---

#### **2.2. Criar Tela de Aguardando Aprovação (2h)**
**Arquivo:** `src/pages/AguardandoAprovacao.tsx` (criar)

```tsx
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
          <div className="mx-auto mb-4 p-4 bg-yellow-100 rounded-full w-fit">
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Cadastro em Análise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Olá <strong>{profile?.nome}</strong>, seu cadastro está em análise pela nossa equipe.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold text-blue-900 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Próximos Passos
            </h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Analisaremos suas informações em até 24 horas úteis</li>
              <li>Você receberá um email quando seu cadastro for aprovado</li>
              <li>Após aprovação, você poderá acessar o sistema normalmente</li>
            </ul>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Informações do Cadastro
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Status:</strong> <span className="text-yellow-600">Aguardando Aprovação</span></p>
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
```

---

#### **2.3. Adicionar Rota e Redirecionamento (1h)**
**Arquivo:** `src/App.tsx`

```tsx
// Adicionar rota
<Route path="/aguardando-aprovacao" element={<AguardandoAprovacao />} />
```

**Arquivo:** `src/pages/auth/Login.tsx`

```typescript
// Modificar useEffect de redirecionamento
useEffect(() => {
  if (user && profile) {
    if (profile.status === 'aguardando_aprovacao') {
      navigate('/aguardando-aprovacao', { replace: true });
    } else if (profile.status === 'ativo') {
      // Redirecionar conforme role
      if (profile.nivel_acesso === 'prestador') {
        navigate('/provider', { replace: true });
      } // ... etc
    }
  }
}, [user, profile, navigate]);
```

---

## ✅ TAREFA 3: Substituir Dados Mockados por Dados Reais em Dashboards
**BUG:** #008 - CRÍTICO
**Tempo Estimado:** 6 horas
**Prioridade:** 🔴 CRÍTICA

### **Descrição do Problema:**
- Dashboard exibe dados mockados (hardcoded) em vez de dados reais do banco
- Métricas de vendas, faturamento, clientes não refletem a realidade
- Tomada de decisão baseada em dados incorretos

### **Solução:**
Implementar queries reais para todas as métricas do dashboard

---

#### **3.1. Criar Hook de Dashboard com Dados Reais (3h)**
**Arquivo:** `src/hooks/useDashboardRealData.ts` (criar)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);

      // 1. Total de vendas do mês
      const { count: vendasMes, error: vendasError } = await supabase
        .from('vendas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioMes.toISOString())
        .lte('created_at', fimMes.toISOString())
        .eq('status', 'concluida');

      if (vendasError) throw vendasError;

      // 2. Faturamento do mês
      const { data: vendasData, error: faturamentoError } = await supabase
        .from('vendas')
        .select('valor_total')
        .gte('created_at', inicioMes.toISOString())
        .lte('created_at', fimMes.toISOString())
        .eq('status', 'concluida');

      if (faturamentoError) throw faturamentoError;

      const faturamentoMes = vendasData?.reduce((sum, v) => sum + Number(v.valor_total), 0) || 0;

      // 3. Total de clientes ativos
      const { count: clientesAtivos, error: clientesError } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      if (clientesError) throw clientesError;

      // 4. Orçamentos pendentes
      const { count: orcamentosPendentes, error: orcamentosError } = await supabase
        .from('orcamentos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente');

      if (orcamentosError) throw orcamentosError;

      // 5. Agendamentos de hoje
      const hoje_str = format(hoje, 'yyyy-MM-dd');
      const { count: agendamentosHoje, error: agendamentosError } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('data_agendamento', hoje_str)
        .in('status', ['confirmado', 'realizado']);

      if (agendamentosError) throw agendamentosError;

      // 6. Guias pendentes
      const { count: guiasPendentes, error: guiasError } = await supabase
        .from('guias')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'emitida');

      if (guiasError) throw guiasError;

      return {
        vendasMes: vendasMes || 0,
        faturamentoMes,
        clientesAtivos: clientesAtivos || 0,
        orcamentosPendentes: orcamentosPendentes || 0,
        agendamentosHoje: agendamentosHoje || 0,
        guiasPendentes: guiasPendentes || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (atualizar frequentemente)
  });
}

export function useDashboardGraficoVendas() {
  return useQuery({
    queryKey: ['dashboard-grafico-vendas'],
    queryFn: async () => {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);

      const { data, error } = await supabase
        .from('vendas')
        .select('created_at, valor_total')
        .gte('created_at', inicioMes.toISOString())
        .eq('status', 'concluida')
        .order('created_at');

      if (error) throw error;

      // Agrupar por dia
      const vendasPorDia = data.reduce((acc, venda) => {
        const dia = format(new Date(venda.created_at), 'dd/MM');
        if (!acc[dia]) {
          acc[dia] = { dia, total: 0, quantidade: 0 };
        }
        acc[dia].total += Number(venda.valor_total);
        acc[dia].quantidade += 1;
        return acc;
      }, {} as Record<string, { dia: string; total: number; quantidade: number }>);

      return Object.values(vendasPorDia);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
```

---

#### **3.2. Modificar AdminDashboard para Usar Dados Reais (2h)**
**Arquivo:** `src/components/dashboard/AdminDashboard.tsx`

```typescript
import { useDashboardMetrics, useDashboardGraficoVendas } from '@/hooks/useDashboardRealData';

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const { data: graficoVendas } = useDashboardGraficoVendas();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Vendas do Mês"
          value={metrics?.vendasMes.toString() || '0'}
          icon={<ShoppingCart className="h-5 w-5" />}
          description="Vendas concluídas"
        />
        <StatCard
          title="Faturamento"
          value={new Intl.NumberFormat('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
          }).format(metrics?.faturamentoMes || 0)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Receita do mês"
        />
        {/* ... restante dos cards */}
      </div>

      {/* Gráfico de vendas com dados reais */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graficoVendas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="quantidade" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### **3.3. Testar Dashboards (1h)**

**Checklist:**
- [ ] Dashboard exibe métricas reais do banco
- [ ] Gráficos renderizam dados corretos
- [ ] Métricas atualizam ao criar nova venda
- [ ] Loading states funcionam corretamente

---

# 🟡 FASE ALTA PRIORIDADE

## **Prazo:** 4-6 dias úteis
## **Prioridade:** ALTA - SISTEMA FUNCIONA MAS COM PROBLEMAS GRAVES

---

## ✅ TAREFA 4: Implementar Validações em Formulários
**BUGS:** #001, #007 - CRÍTICO/ALTO
**Tempo Estimado:** 6 horas
**Prioridade:** 🟡 ALTA

### **Passos:**

#### **4.1. Criar Validações Centralizadas (2h)**
**Arquivo:** `src/lib/validations.ts` (modificar)

```typescript
import { z } from 'zod';

// Validação de CPF
export const cpfSchema = z.string().refine(isValidCPF, {
  message: 'CPF inválido',
});

// Validação de CNPJ
export const cnpjSchema = z.string().refine(isValidCNPJ, {
  message: 'CNPJ inválido',
});

// Validação de telefone
export const telefoneSchema = z.string().refine(isValidPhone, {
  message: 'Telefone inválido (formato: (00) 00000-0000)',
});

// Validação de email
export const emailSchema = z.string().email('Email inválido');

// Schema completo de cliente
export const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema,
  endereco: z.string().optional(),
  id_associado: z.string().min(5, 'ID associado inválido'),
});

// Schema completo de colaborador
export const colaboradorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: emailSchema,
  nivel_acesso: z.enum(['colaborador', 'atendente', 'gerente', 'admin']),
  cargo: z.string().optional(),
});
```

---

#### **4.2. Aplicar Validações em FormularioCliente (1h)**
**Arquivo:** `src/components/clientes/FormularioCliente.tsx`

```typescript
import { clienteSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(clienteSchema),
  defaultValues: {
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    id_associado: '',
  },
});

const onSubmit = (data: z.infer<typeof clienteSchema>) => {
  // Dados validados garantidamente
  createCliente.mutate(data);
};
```

---

#### **4.3. Aplicar Validações em CadastroColaborador (1h)**
Similar ao passo anterior, aplicar `colaboradorSchema`

---

#### **4.4. Testar Validações (2h)**

**Checklist:**
- [ ] CPF inválido é rejeitado
- [ ] Telefone inválido é rejeitado
- [ ] Email inválido é rejeitado
- [ ] Mensagens de erro exibidas corretamente
- [ ] Formulário não submete com dados inválidos

---

## ✅ TAREFA 5: Adicionar Ações de Cancelar/Estornar Vendas
**BUGS:** #003, #004 - ALTO
**Tempo Estimado:** 5 horas
**Prioridade:** 🟡 ALTA

### **Passos:**

#### **5.1. Adicionar Botões na Lista de Vendas (1h)**
**Arquivo:** `src/components/vendas/VendaTableRow.tsx` (criar)

```tsx
import { useCancelarVenda, useEstornarVenda } from '@/hooks/vendas/useVendaActions';

export function VendaTableRow({ venda }) {
  const cancelar = useCancelarVenda();
  const estornar = useEstornarVenda();

  const handleCancelar = () => {
    if (confirm(`Cancelar venda #${venda.id}? Esta ação cancelará todas as guias associadas.`)) {
      cancelar.mutate(venda.id);
    }
  };

  const handleEstornar = () => {
    if (confirm(`Estornar venda #${venda.id}? Esta ação estornará todas as guias PAGAS.`)) {
      estornar.mutate(venda.id);
    }
  };

  return (
    <TableRow>
      {/* ... colunas ... */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/hub/sales/${venda.id}`)}>
              Visualizar
            </DropdownMenuItem>
            {venda.status === 'concluida' && (
              <DropdownMenuItem onClick={handleCancelar} className="text-destructive">
                Cancelar Venda
              </DropdownMenuItem>
            )}
            {venda.status === 'concluida' && hasGuiasPagas(venda) && (
              <DropdownMenuItem onClick={handleEstornar} className="text-destructive">
                Estornar Venda
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
```

---

#### **5.2. Verificar Hooks Existentes (já implementados)**
Os hooks `useCancelarVenda` e `useEstornarVenda` já existem em:
`src/hooks/vendas/useVendaActions.ts`

---

#### **5.3. Testar Fluxo (2h)**

**Checklist:**
- [ ] Botão "Cancelar" aparece apenas para vendas "concluídas"
- [ ] Cancelar venda muda status para "cancelada"
- [ ] Guias associadas são canceladas
- [ ] Botão "Estornar" aparece apenas se houver guias pagas
- [ ] Estornar venda muda status para "estornada"
- [ ] Guias pagas são estornadas

---

## ✅ TAREFA 6: Implementar Auto-Expiração de Orçamentos
**BUG:** #006 - ALTO
**Tempo Estimado:** 4 horas
**Prioridade:** 🟡 ALTA

### **Solução:**
Criar **Edge Function** no Supabase para rodar diariamente e expirar orçamentos vencidos

---

#### **6.1. Criar Edge Function (2h)**
**Arquivo:** `supabase/functions/expirar-orcamentos/index.ts` (criar)

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const hoje = new Date().toISOString().split('T')[0];

    // Atualizar orçamentos com data de validade vencida
    const { data, error } = await supabase
      .from('orcamentos')
      .update({ status: 'expirado' })
      .eq('status', 'pendente')
      .lt('data_validade', hoje);

    if (error) throw error;

    return new Response(
      JSON.stringify({
        success: true,
        message: `${data?.length || 0} orçamentos expirados`,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

---

#### **6.2. Configurar Cron Job (Supabase Dashboard) (30min)**

**Passos:**
1. Acessar Supabase Dashboard
2. Ir em **Database** → **Extensions**
3. Ativar extensão **pg_cron**
4. Ir em **SQL Editor** e executar:

```sql
-- Criar cron job para rodar diariamente às 00:00
SELECT cron.schedule(
  'expirar-orcamentos-diario',
  '0 0 * * *', -- Todo dia à meia-noite
  $$
  SELECT net.http_post(
    url := 'https://[SEU-PROJECT-ID].supabase.co/functions/v1/expirar-orcamentos',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer [ANON-KEY]"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

---

#### **6.3. Testar Manualmente (1h)**

```bash
# Testar edge function manualmente
curl -X POST https://[PROJECT-ID].supabase.co/functions/v1/expirar-orcamentos \
  -H "Authorization: Bearer [ANON-KEY]"
```

**Checklist:**
- [ ] Edge function retorna sucesso
- [ ] Orçamentos vencidos mudam para "expirado"
- [ ] Orçamentos válidos não são afetados

---

## ✅ TAREFA 7: Gerar Senha Provisória para Colaboradores
**BUG:** #002 - ALTO
**Tempo Estimado:** 3 horas
**Prioridade:** 🟡 ALTA

### **Solução:**
Criar Edge Function para criar usuário com senha provisória e enviar por email

---

#### **7.1. Modificar CadastroColaborador (1h)**
**Arquivo:** `src/components/colaboradores/CadastroColaborador.tsx`

```typescript
const handleSubmit = async (data: ColaboradorForm) => {
  try {
    // Gerar senha provisória aleatória
    const senhaProvisoria = generateRandomPassword(12);

    // Criar usuário via Edge Function
    const { data: result, error } = await supabase.functions.invoke('create-user', {
      body: {
        email: data.email,
        password: senhaProvisoria,
        nome: data.nome,
        nivel_acesso: data.nivel_acesso,
        cargo: data.cargo,
      },
    });

    if (error) throw error;

    toast({
      title: 'Colaborador criado!',
      description: `Senha provisória enviada para ${data.email}`,
    });
  } catch (error) {
    toast({
      title: 'Erro ao criar colaborador',
      description: error.message,
      variant: 'destructive',
    });
  }
};

function generateRandomPassword(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
```

---

#### **7.2. Verificar Edge Function (já existe)**
Edge function `create-user` já existe em:
`supabase/functions/create-user/index.ts`

Verificar se envia email com senha provisória.

---

#### **7.3. Testar Fluxo (1h)**

**Checklist:**
- [ ] Colaborador criado com sucesso
- [ ] Senha provisória gerada
- [ ] Email enviado com senha (verificar Resend)
- [ ] Colaborador consegue fazer login com senha provisória
- [ ] Sistema força troca de senha no primeiro login

---

# 🟢 FASE MÉDIA PRIORIDADE

## **Prazo:** 3-4 dias úteis
## **Prioridade:** MÉDIA - MELHORIAS DE USABILIDADE

---

## ✅ TAREFA 8: Adicionar Filtros em Listas
**BUGS:** #005, #011 - MÉDIO
**Tempo Estimado:** 4 horas
**Prioridade:** 🟢 MÉDIA

### **8.1. Implementar Filtros em Orçamentos (2h)**
### **8.2. Implementar Filtros em Guias do Prestador (2h)**

*(Detalhes omitidos por brevidade)*

---

## ✅ TAREFA 9: Integrar Dados Reais no Portal do Cliente
**BUG:** #012 - ALTO
**Tempo Estimado:** 4 horas
**Prioridade:** 🟢 MÉDIA

*(Detalhes omitidos por brevidade)*

---

## ✅ TAREFA 10: Remover Sistemas Redundantes
**REDUNDÂNCIAS:** #1-#6
**Tempo Estimado:** 3 horas
**Prioridade:** 🟢 MÉDIA

### **Arquivos a Remover:**
- `src/components/layout/navigation/menus/ProviderMenu.tsx` (usar `PrestadorMenuSimplified.tsx`)
- `src/components/usuarios/ConviteUsuario.tsx` (obsoleto)
- `src/components/usuarios/ListaConvites.tsx` (obsoleto)
- `src/components/clientes/ClientesLista.tsx` (usar `OptimizedClientesLista.tsx`)
- `src/components/clientes/ListaClientes.tsx` (duplicado)

### **Consolidar:**
- Dashboards em um único componente com renderização condicional
- Services e hooks (remover duplicação)

---

# 📊 RESUMO DE PRIORIZAÇÃO

| Fase | Tempo | Prioridade | Tarefas |
|------|-------|------------|---------|
| **CRÍTICA** | 3-5 dias | 🔴 MÁXIMA | Tarefas 1, 2, 3 |
| **ALTA** | 4-6 dias | 🟡 ALTA | Tarefas 4, 5, 6, 7 |
| **MÉDIA** | 3-4 dias | 🟢 MÉDIA | Tarefas 8, 9, 10 |

**TOTAL:** 10-15 dias úteis

---

# ✅ CRITÉRIOS DE ACEITAÇÃO

## **Para Fase Crítica (BLOQUEADORES):**
- [ ] Prestadores podem ser aprovados via `/approvals`
- [ ] Prestadores aguardando aprovação veem tela específica
- [ ] Dashboard exibe apenas dados reais do banco

## **Para Fase Alta:**
- [ ] Todos os formulários possuem validações
- [ ] Vendas podem ser canceladas/estornadas
- [ ] Orçamentos expiram automaticamente
- [ ] Colaboradores recebem senha provisória

## **Para Fase Média:**
- [ ] Listas possuem filtros funcionais
- [ ] Portal do cliente exibe dados reais
- [ ] Código sem redundâncias

---

**PLANO CRIADO POR:** QA Senior Engineer
**DATA:** 2025-01-XX
**ÚLTIMA ATUALIZAÇÃO:** 2025-01-XX
