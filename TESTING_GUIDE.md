# 🧪 GUIA DE TESTES - AGENDAJA

## 📋 Índice
- [6.1 Testes de Segurança](#61-testes-de-segurança)
- [6.2 Testes de Fluxos Completos](#62-testes-de-fluxos-completos)
- [6.3 Checklist de Performance](#63-checklist-de-performance)

---

## 6.1 Testes de Segurança

### 🔒 Teste 1: Row Level Security (RLS)

#### Objetivo
Validar que usuários só podem acessar seus próprios dados e não conseguem acessar dados de outros usuários.

#### Cenários de Teste

##### A) Cliente A tentando acessar agendamentos do Cliente B

**Setup:**
1. Criar dois clientes (Cliente A e Cliente B) no sistema
2. Cada cliente tem agendamentos associados
3. Login como Cliente A

**Teste:**
```sql
-- Como Cliente A (user_id = UUID_A)
-- Esta query deve retornar APENAS agendamentos do Cliente A
SELECT * FROM agendamentos WHERE cliente_id = 'UUID_B';
-- ❌ Deve retornar: 0 registros (RLS bloqueando)
```

**Via API (Frontend):**
```typescript
// Como Cliente A logado
const { data } = await supabase
  .from('agendamentos')
  .select('*')
  .eq('cliente_id', 'UUID_DO_CLIENTE_B'); // Tentando acessar dados de outro cliente

// ❌ Esperado: data = [] (RLS deve bloquear)
```

**Resultado Esperado:**
- ✅ RLS deve bloquear o acesso
- ✅ Nenhum dado do Cliente B deve ser retornado
- ✅ Sem erros expostos ao usuário

---

##### B) Prestador A tentando ver guias do Prestador B

**Setup:**
1. Criar dois prestadores (Prestador A e Prestador B)
2. Cada prestador tem guias associadas
3. Login como Prestador A

**Teste:**
```sql
-- Como Prestador A
SELECT * FROM guias WHERE prestador_id = 'UUID_PRESTADOR_B';
-- ❌ Deve retornar: 0 registros
```

**Via API:**
```typescript
// Como Prestador A logado
const { data } = await supabase
  .from('guias')
  .select('*')
  .eq('prestador_id', 'UUID_DO_PRESTADOR_B');

// ❌ Esperado: data = []
```

**Resultado Esperado:**
- ✅ RLS deve bloquear
- ✅ Dados de outro prestador não devem vazar

---

### 🔐 Teste 2: Escalação de Privilégios

#### Objetivo
Validar que usuários não podem escalar privilégios tentando acessar funcionalidades de roles superiores.

#### Cenários de Teste

##### A) Atendente tentando acessar configurações (admin-only)

**Setup:**
1. Login como usuário com role 'atendente'
2. Tentar acessar rota `/hub/configuracoes`

**Teste Manual:**
1. Login como atendente
2. Navegar diretamente para: `/hub/configuracoes`
3. Ou via código:
```typescript
// Como atendente logado
const { data } = await supabase
  .from('organizacoes')
  .update({ configuracoes: { teste: true } })
  .eq('id', 'UUID_ORGANIZACAO');

// ❌ Deve falhar - RLS deve bloquear
```

**Resultado Esperado:**
- ✅ Rota deve redirecionar ou mostrar "Acesso negado"
- ✅ Guard deve bloquear acesso: `AdminGuard`
- ✅ RLS deve impedir update na tabela

---

##### B) Colaborador tentando ver financeiro (gerente-only)

**Setup:**
1. Login como colaborador
2. Tentar acessar `/hub/financeiro`

**Teste:**
```typescript
// Como colaborador
const { data } = await supabase
  .from('contas_pagar')
  .select('*');

// ❌ Esperado: erro ou data = []
```

**Resultado Esperado:**
- ✅ Acesso negado pela RLS policy
- ✅ Guard de rota deve bloquear

---

### 🛡️ Teste 3: SQL Injection

#### Objetivo
Validar que inputs de usuário não podem ser usados para SQL injection.

#### Cenários de Teste

##### A) Busca de Clientes com input malicioso

**Setup:**
```typescript
// Tentar injetar SQL em campo de busca
const maliciousInput = "'; DROP TABLE clientes; --";

const { data } = await supabase
  .from('clientes')
  .select('*')
  .ilike('nome', `%${maliciousInput}%`);
```

**Resultado Esperado:**
- ✅ Query deve ser sanitizada automaticamente pelo Supabase
- ✅ Nenhuma tabela deve ser dropada
- ✅ Query deve retornar 0 resultados normalmente

---

### 🔍 Teste 4: Auditoria

#### Objetivo
Validar que ações importantes são registradas no log de auditoria.

#### Cenários de Teste

##### A) Reset de senha de usuário

**Setup:**
1. Admin faz reset de senha de um usuário
2. Verificar se foi registrado em `user_audit_log`

**Teste:**
```typescript
// Admin reseta senha
await resetUserPassword(userId);

// Verificar log
const { data } = await supabase
  .from('user_audit_log')
  .select('*')
  .eq('user_id', userId)
  .eq('action', 'password_reset')
  .order('created_at', { ascending: false })
  .limit(1);

// ✅ Deve existir um registro
expect(data).toHaveLength(1);
expect(data[0].performed_by).toBe(adminUserId);
```

**Resultado Esperado:**
- ✅ Log de auditoria criado
- ✅ Contém: user_id, action, performed_by, timestamp
- ✅ Detalhes incluem IP e User-Agent (se disponível)

---

### ✅ Teste 5: Validação de Roles

#### Objetivo
Garantir que roles estão armazenados APENAS na tabela `user_roles` e não em profiles.

#### Teste:

**Verificação Manual no Supabase Dashboard:**

1. Ir para: SQL Editor
2. Executar:
```sql
-- ❌ Esta query NÃO deve existir (roles não devem estar em profiles)
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND column_name IN ('role', 'roles', 'user_role');

-- ✅ Esperado: 0 resultados

-- ✅ Verificar que user_roles existe
SELECT EXISTS (
  SELECT 1 FROM information_schema.tables 
  WHERE table_name = 'user_roles'
);
-- Esperado: true
```

3. Verificar estrutura de `user_roles`:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_roles';

-- ✅ Deve ter:
-- - id (uuid)
-- - user_id (uuid)
-- - role (app_role enum)
-- - organizacao_id (uuid)
-- - created_at (timestamp)
```

**Resultado Esperado:**
- ✅ Tabela `profiles` NÃO contém colunas de role
- ✅ Tabela `user_roles` existe e está populada
- ✅ Enum `app_role` existe com valores: admin, gerente, atendente, colaborador, prestador, cliente

---

## 6.2 Testes de Fluxos Completos

### 🧑‍💼 Fluxo 1: Cliente

#### Setup
- Usuário novo sem cadastro

#### Passos:

1. **Cadastro**
   - [ ] Acessar `/cadastro/cliente`
   - [ ] Preencher formulário com dados válidos
   - [ ] CPF deve ser validado
   - [ ] Email deve ser único
   - [ ] Senha mínimo 8 caracteres
   - [ ] Submeter formulário

2. **Verificação de Email**
   - [ ] Receber email de confirmação
   - [ ] Clicar no link de verificação
   - [ ] Email deve conter código de autenticação (se aplicável)

3. **Login**
   - [ ] Fazer login com credenciais
   - [ ] Redirecionado para `/cliente/dashboard`
   - [ ] Dashboard mostra dados do cliente

4. **Busca no Marketplace**
   - [ ] Navegar para marketplace
   - [ ] Buscar serviço específico
   - [ ] Ver detalhes do serviço

5. **Solicitar Agendamento**
   - [ ] Clicar em "Agendar"
   - [ ] Selecionar data
   - [ ] Selecionar horário
   - [ ] Ver pré-visualização do orçamento
   - [ ] Confirmar agendamento

6. **Receber Orçamento**
   - [ ] Receber notificação in-app
   - [ ] Receber email
   - [ ] Ver orçamento em `/cliente/orcamentos`

7. **Aceitar Orçamento**
   - [ ] Abrir modal de detalhes
   - [ ] Revisar informações
   - [ ] Clicar em "Aceitar"
   - [ ] Orçamento convertido em venda
   - [ ] Guias geradas

8. **Receber Confirmação**
   - [ ] Email de confirmação enviado
   - [ ] Código de autenticação gerado
   - [ ] Agendamento visível no dashboard

9. **Comparecer ao Serviço**
   - [ ] Apresentar código no dia
   - [ ] Status da guia atualizado para "realizada"

10. **Avaliar Serviço**
    - [ ] Receber solicitação de avaliação
    - [ ] Deixar nota de 1-5 estrelas
    - [ ] Adicionar comentário (opcional)
    - [ ] Submeter avaliação

**Resultado Esperado:**
- ✅ Fluxo completo sem erros
- ✅ Todos os emails enviados
- ✅ Notificações funcionando
- ✅ Dados persistidos corretamente

---

### 👨‍⚕️ Fluxo 2: Prestador

#### Passos:

1. **Cadastro**
   - [ ] Acessar `/cadastro/prestador`
   - [ ] Preencher formulário multi-step:
     - Etapa 1: Tipo (PF/PJ)
     - Etapa 2: Dados pessoais/empresariais
     - Etapa 3: Especialidades
     - Etapa 4: Dados bancários
     - Etapa 5: Upload de documentos
   - [ ] Status inicial: `aguardando_aprovacao`

2. **Aprovação pelo Admin**
   - [ ] Admin vê solicitação em `/hub/aprovacoes`
   - [ ] Admin visualiza detalhes
   - [ ] Admin aprova cadastro
   - [ ] Registro criado em `prestadores`
   - [ ] Role 'prestador' atribuído em `user_roles`

3. **Receber Credenciais**
   - [ ] Email de aprovação enviado
   - [ ] Credenciais de acesso incluídas
   - [ ] Link para login

4. **Login**
   - [ ] Login com credenciais
   - [ ] Redirecionado para `/prestador/portal`

5. **Configurar Agenda e Serviços**
   - [ ] Configurar horários de disponibilidade
   - [ ] Listar serviços oferecidos
   - [ ] Definir valores

6. **Receber Guia**
   - [ ] Notificação de nova guia
   - [ ] Ver detalhes da guia
   - [ ] Código de autenticação do cliente

7. **Executar Serviço**
   - [ ] Validar código do cliente
   - [ ] Executar procedimento
   - [ ] Atualizar status para "realizada"

8. **Solicitar Faturamento**
   - [ ] Acessar painel de faturamento
   - [ ] Ver guias realizadas
   - [ ] Solicitar pagamento
   - [ ] Pagamento agendado em `agenda_pagamentos`

**Resultado Esperado:**
- ✅ Aprovação funciona
- ✅ Acesso ao portal
- ✅ Gestão de guias
- ✅ Faturamento correto

---

### 🏢 Fluxo 3: Hub (Atendente)

#### Passos:

1. **Login**
   - [ ] Login como atendente
   - [ ] Redirecionado para `/hub/dashboard`
   - [ ] Dashboard personalizado para role

2. **Nova Venda**
   - [ ] Clicar em "Nova Venda"
   - [ ] Stepper visível com etapas

3. **Buscar Cliente**
   - [ ] Buscar cliente por CPF/nome
   - [ ] Cliente encontrado: mostrar dados
   - [ ] Cliente não encontrado: opção de cadastrar

4. **Selecionar Serviços**
   - [ ] Buscar serviços disponíveis
   - [ ] Adicionar múltiplos serviços
   - [ ] Ver subtotal atualizado
   - [ ] Aplicar descontos (se aplicável)

5. **Checkout**
   - [ ] Revisar itens
   - [ ] Selecionar método de pagamento
   - [ ] Gerar código de barras (se boleto)
   - [ ] Finalizar venda

6. **Pagamento**
   - [ ] Registrar pagamento
   - [ ] Venda criada em `vendas`
   - [ ] Serviços criados em `vendas_servicos`
   - [ ] Guias geradas automaticamente

7. **Controle Financeiro**
   - [ ] Acessar `/hub/financeiro`
   - [ ] Ver contas a receber
   - [ ] Ver contas a pagar
   - [ ] Filtrar por período

8. **Agendar Pagamentos**
   - [ ] Acessar agenda de pagamentos
   - [ ] Definir data de pagamento para prestador
   - [ ] Confirmar agendamento

**Resultado Esperado:**
- ✅ Venda finalizada com sucesso
- ✅ Guias geradas
- ✅ Financeiro atualizado
- ✅ Notificações enviadas

---

## 6.3 Checklist de Performance

### ✅ Índices de Banco de Dados

- [x] `idx_agendamentos_data` - Agendamentos por data
- [x] `idx_agendamentos_cliente` - Agendamentos por cliente
- [x] `idx_agendamentos_prestador` - Agendamentos por prestador
- [x] `idx_guias_status` - Guias por status
- [x] `idx_guias_cliente` - Guias por cliente
- [x] `idx_guias_prestador` - Guias por prestador
- [x] `idx_vendas_created_at` - Vendas por data
- [x] `idx_avaliacoes_prestador` - Avaliações por prestador
- [x] `idx_notifications_unread` - Notificações não lidas (partial index)

### ✅ Configuração de Cache (React Query)

- [x] Dados estáticos: 10 minutos (organizações, serviços)
- [x] Dados semi-estáticos: 5 minutos (prestadores, clientes)
- [x] Dados dinâmicos: 1 minuto (agendamentos, vendas)
- [x] Realtime: 0 cache (notificações)

### 📦 Lazy Loading

**Componentes para Lazy Load:**

```typescript
// src/components/layout/LazyPages.tsx
export const LazyVendas = lazy(() => import('@/pages/Vendas'));
export const LazyOrcamentos = lazy(() => import('@/pages/Orcamentos'));
export const LazyRelatorios = lazy(() => import('@/pages/RelatoriosCentralizadosPage'));
export const LazyFinanceiro = lazy(() => import('@/pages/Financeiro'));
export const LazyGuias = lazy(() => import('@/pages/Guias'));
export const LazyQualityPage = lazy(() => import('@/pages/quality/QualityPage'));
export const LazySecurityPage = lazy(() => import('@/pages/security/SecurityPage'));
```

**Checklist:**
- [ ] Rotas pesadas usando lazy loading
- [ ] Suspense boundaries configurados
- [ ] Loading states adequados

### 🖼️ Otimização de Imagens

- [ ] Imagens lazy loaded
- [ ] Formato WebP quando possível
- [ ] Dimensões apropriadas (não carregar 4K para thumbnails)
- [ ] Placeholder durante carregamento

### 📊 Code Splitting

- [ ] Rotas divididas por portal (hub, prestador, cliente)
- [ ] Componentes grandes lazy loaded
- [ ] Bibliotecas pesadas (ex: PDF) carregadas sob demanda

### 🎯 Métricas de Performance

**Ferramentas para Monitorar:**

1. **Lighthouse (Chrome DevTools)**
   - Performance Score > 80
   - First Contentful Paint < 2s
   - Time to Interactive < 4s
   - Cumulative Layout Shift < 0.1

2. **React DevTools Profiler**
   - Identificar componentes lentos
   - Re-renders desnecessários

3. **Network Tab**
   - Bundle size total < 500KB (gzipped)
   - Chunks individuais < 200KB
   - Requests < 50 no carregamento inicial

4. **Bundle Analyzer**
```bash
npm run build
npx vite-bundle-visualizer
```

### 🚀 Otimizações Aplicadas

- [x] ✅ Índices de banco adicionados
- [x] ✅ Cache do React Query configurado
- [ ] 🔄 Lazy loading implementado
- [ ] 🔄 Imagens otimizadas
- [ ] 🔄 Code splitting completo
- [ ] 🔄 Service Worker para cache offline

---

## 📝 Notas Finais

### Ferramentas Úteis

- **Supabase Dashboard**: https://supabase.com/dashboard
- **React Query Devtools**: Habilitado em desenvolvimento
- **Chrome DevTools**: Performance, Network, Lighthouse

### Comandos Úteis

```bash
# Rodar testes
npm run test

# Análise de bundle
npm run build
npx vite-bundle-visualizer

# Lighthouse CI
npx lighthouse https://app.agendaja.com.br --view

# Verificar cobertura de testes
npm run test:coverage
```

### Links de Referência

- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Web Vitals](https://web.dev/vitals/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
