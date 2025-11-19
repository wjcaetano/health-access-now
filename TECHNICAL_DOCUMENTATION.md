# Documentação Técnica - AgendaJá

## Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Arquitetura](#arquitetura)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Banco de Dados](#banco-de-dados)
5. [Fluxos de Dados Principais](#fluxos-de-dados-principais)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Guia de Contribuição](#guia-de-contribuição)
8. [Deploy e Ambiente](#deploy-e-ambiente)

---

## Visão Geral do Sistema

**AgendaJá** é uma plataforma centralizada de gestão de serviços de saúde que conecta clientes (pacientes) com prestadores de serviços (clínicas, laboratórios e profissionais de saúde). O sistema gerencia todo o ciclo de vida desde o orçamento até a execução do serviço e faturamento.

### Principais Funcionalidades

- **Portal Hub (Admin/Gerente)**: Gestão completa do sistema, aprovação de prestadores, controle financeiro
- **Portal Prestador**: Gerenciamento de serviços, agenda, guias e faturamento
- **Portal Cliente**: Agendamento de serviços, acompanhamento de orçamentos e histórico
- **Sistema de Orçamentos**: Criação, aprovação e conversão em vendas
- **Guias de Serviço**: Controle completo do ciclo de vida do serviço
- **Sistema de Avaliações**: Feedback de clientes sobre serviços prestados

---

## Arquitetura

### Stack Tecnológico

#### Frontend
- **React 18.3.1**: Biblioteca principal para UI
- **TypeScript**: Type safety e melhor DX
- **Vite**: Build tool e dev server
- **React Router v6**: Roteamento SPA
- **TanStack Query v5**: State management e cache de dados
- **Tailwind CSS**: Framework CSS utility-first
- **Shadcn/ui**: Componentes de UI reutilizáveis
- **Zod**: Validação de schemas e forms
- **React Hook Form**: Gerenciamento de formulários

#### Backend
- **Supabase**: Backend-as-a-Service
  - PostgreSQL: Banco de dados relacional
  - Auth: Sistema de autenticação
  - Storage: Armazenamento de arquivos
  - Edge Functions: Serverless functions
  - Realtime: Notificações em tempo real

#### Ferramentas de Desenvolvimento
- **ESLint**: Linting
- **Vitest**: Testes unitários
- **Playwright**: Testes E2E
- **Bun**: Package manager e runtime

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Vite)                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Hub Portal  │  │Provider Portal│  │Client Portal │      │
│  │  (Admin)     │  │  (Prestador)  │  │  (Cliente)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Query (Cache & State Management)       │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↕                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Supabase Client (API Layer)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │     Auth     │  │   Storage    │      │
│  │   Database   │  │   Service    │  │   Buckets    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Edge Functions│  │   Realtime   │  │     RLS      │      │
│  │  (Serverless) │  │ Notifications│  │   Policies   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrutura do Projeto

```
src/
├── components/          # Componentes React organizados por feature
│   ├── agendamentos/    # Agendamentos
│   ├── auth/            # Autenticação
│   ├── avaliacoes/      # Avaliações
│   ├── clientes/        # Clientes
│   ├── colaboradores/   # Colaboradores
│   ├── dashboard/       # Dashboards
│   ├── guias/           # Guias de serviço
│   ├── layout/          # Layout e navegação
│   │   ├── guards/      # Route guards
│   │   └── navigation/  # Menus e navegação
│   ├── orcamentos/      # Orçamentos
│   ├── portals/         # Portais (Hub, Prestador, Cliente)
│   ├── prestadores/     # Prestadores
│   ├── shared/          # Componentes compartilhados
│   ├── ui/              # Shadcn/ui components
│   └── vendas/          # Vendas
│
├── contexts/            # React Contexts
│   ├── AuthContext.tsx  # Contexto de autenticação
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/               # Custom React Hooks
│   ├── guias/           # Hooks de guias
│   ├── vendas/          # Hooks de vendas
│   ├── useAgendamentos.ts
│   ├── useClientes.ts
│   ├── useClientePortalData.ts
│   ├── useColaboradores.ts
│   ├── useDashboardRealData.ts
│   ├── useGuias.ts
│   ├── useOrcamentos.ts
│   ├── usePrestadores.ts
│   ├── useServicos.ts
│   └── useVendas.ts
│
├── integrations/        # Integrações externas
│   └── supabase/
│       ├── client.ts    # Cliente Supabase configurado
│       └── types.ts     # Types gerados do DB (read-only)
│
├── lib/                 # Utilitários e helpers
│   ├── constants.ts     # Constantes do sistema
│   ├── formatters.ts    # Formatação de dados
│   ├── routes.ts        # Definição de rotas
│   ├── utils.ts         # Utilitários gerais
│   └── validations.ts   # Schemas Zod de validação
│
├── pages/               # Páginas da aplicação
│   ├── auth/            # Páginas de autenticação
│   ├── clientes/        # Páginas do portal cliente
│   ├── prestador/       # Páginas do portal prestador
│   └── [outras páginas]
│
├── services/            # Serviços de API
│   ├── clientesService.ts
│   ├── guiasService.ts
│   └── prestadoresService.ts
│
├── types/               # TypeScript types
│   ├── guias.ts
│   └── index.ts
│
├── App.tsx             # Componente raiz
├── main.tsx            # Entry point
└── index.css           # Estilos globais e design tokens

supabase/
├── functions/          # Edge Functions
│   ├── create-user/
│   ├── expirar-orcamentos/
│   ├── reset-user-password/
│   └── send-email/
│
├── migrations/         # Migrações do banco de dados
└── config.toml        # Configuração do Supabase
```

---

## Banco de Dados

### Modelo de Dados Principal

#### Entidades Core

**organizacoes** - Organizações/Unidades
```sql
- id (uuid, PK)
- nome (text)
- codigo (text, unique)
- tipo_organizacao (text) -- 'clinica', 'hub', 'franquia'
- status (text) -- 'ativo', 'inativo'
- configuracoes (jsonb)
- horario_funcionamento (jsonb)
- created_at, updated_at
```

**profiles** - Perfis de usuário (ligado a auth.users)
```sql
- id (uuid, PK, FK -> auth.users)
- email (text)
- nome (text)
- nivel_acesso (text) -- 'admin', 'gerente', 'atendente', 'colaborador', 'prestador', 'cliente'
- status (text) -- 'pendente', 'aguardando_aprovacao', 'ativo', 'suspenso', 'inativo'
- organizacao_id (uuid, FK)
- colaborador_id (uuid, FK)
- prestador_id (uuid, FK)
- cliente_id (uuid, FK)
- foto_url (text)
- created_at, updated_at
```

**user_roles** - Tabela de roles (segurança)
```sql
- id (uuid, PK)
- user_id (uuid, FK -> auth.users)
- role (app_role enum) -- 'admin', 'gerente', 'atendente', 'colaborador', 'prestador', 'cliente'
- organizacao_id (uuid, FK)
- created_at
```

**clientes** - Clientes/Pacientes
```sql
- id (uuid, PK)
- nome (text)
- cpf (text, unique)
- email (text)
- telefone (text)
- endereco (text)
- id_associado (text, unique)
- organizacao_id (uuid, FK)
- data_cadastro
```

**prestadores** - Prestadores de serviço
```sql
- id (uuid, PK)
- nome (text)
- tipo (text) -- 'clinica', 'laboratorio', 'profissional'
- cnpj (text, unique)
- email (text)
- telefone (text)
- endereco (text)
- especialidades (text[])
- localizacao (text)
- disponibilidade (text)
- comissao (numeric) -- % de comissão do hub
- banco, agencia, conta, tipo_conta
- media_avaliacoes (numeric)
- total_avaliacoes (integer)
- ativo (boolean)
- organizacao_id (uuid, FK)
- data_cadastro
```

**servicos** - Serviços oferecidos
```sql
- id (uuid, PK)
- nome (text)
- categoria (text)
- descricao (text)
- valor_custo (numeric)
- valor_venda (numeric)
- tempo_estimado (text)
- prestador_id (uuid, FK)
- organizacao_id (uuid, FK)
- ativo (boolean)
- created_at
```

**servico_prestadores** - Relacionamento N:N serviços-prestadores
```sql
- id (uuid, PK)
- servico_id (uuid, FK)
- prestador_id (uuid, FK)
- ativo (boolean)
- created_at
```

#### Ciclo de Vendas

**orcamentos** - Orçamentos
```sql
- id (uuid, PK)
- cliente_id (uuid, FK)
- prestador_id (uuid, FK)
- servico_id (uuid, FK)
- valor_custo (numeric)
- valor_venda (numeric)
- percentual_desconto (numeric)
- valor_final (numeric)
- data_validade (date)
- status (text) -- 'pendente', 'aprovado', 'recusado', 'expirado'
- observacoes (text)
- venda_id (uuid, FK) -- ligação com venda após aprovação
- organizacao_id (uuid, FK)
- created_at
```

**vendas** - Vendas realizadas
```sql
- id (uuid, PK)
- cliente_id (uuid, FK)
- valor_total (numeric)
- metodo_pagamento (text) -- 'pix', 'cartao', 'dinheiro', 'boleto'
- status (text) -- 'concluida', 'cancelada', 'estornada'
- observacoes (text)
- organizacao_id (uuid, FK)
- created_at
```

**vendas_servicos** - Serviços de uma venda
```sql
- id (uuid, PK)
- venda_id (uuid, FK)
- servico_id (uuid, FK)
- prestador_id (uuid, FK)
- valor (numeric)
- status (text) -- 'vendido', 'agendado', 'realizado', 'cancelado'
- data_agendamento (date)
- horario (time)
- organizacao_id (uuid, FK)
- created_at
```

**guias** - Guias de serviço (autorização)
```sql
- id (uuid, PK)
- agendamento_id (uuid, FK)
- cliente_id (uuid, FK)
- prestador_id (uuid, FK)
- servico_id (uuid, FK)
- valor (numeric)
- codigo_autenticacao (text, unique)
- status (text) -- 'emitida', 'realizada', 'faturada', 'paga', 'cancelada', 'estornada', 'expirada'
- data_emissao
- data_realizacao
- data_faturamento
- data_pagamento
- data_cancelamento
- data_estorno
- organizacao_id (uuid, FK)
```

#### Outros

**agendamentos** - Agendamentos
```sql
- id (uuid, PK)
- cliente_id (uuid, FK)
- prestador_id (uuid, FK)
- servico_id (uuid, FK)
- data_agendamento (date)
- horario (time)
- status (text) -- 'agendado', 'confirmado', 'cancelado', 'realizado'
- codigo_autenticacao (text)
- observacoes (text)
- organizacao_id (uuid, FK)
- created_at
```

**avaliacoes** - Avaliações de serviços
```sql
- id (uuid, PK)
- guia_id (uuid, FK)
- cliente_id (uuid, FK)
- prestador_id (uuid, FK)
- nota (integer) -- 1-5
- comentario (text)
- resposta_prestador (text)
- organizacao_id (uuid, FK)
- created_at, updated_at
```

**colaboradores** - Colaboradores do hub
```sql
- id (uuid, PK)
- nome (text)
- email (text, unique)
- cargo (text)
- nivel_acesso (text)
- status_trabalho (text) -- 'trabalhando', 'fora_trabalho'
- ativo (boolean)
- organizacao_id (uuid, FK)
- data_cadastro
```

**ponto_eletronico** - Registro de ponto
```sql
- id (uuid, PK)
- colaborador_id (uuid, FK)
- data_ponto (date)
- tipo_ponto (text) -- 'entrada', 'saida'
- hora_entrada, hora_saida
- observacao (text)
- organizacao_id (uuid, FK)
- created_at
```

**contas_pagar** - Contas a pagar
```sql
- id (uuid, PK)
- prestador_id (uuid, FK)
- valor (numeric)
- data_vencimento (date)
- data_pagamento (date)
- status (text) -- 'agendado', 'pago', 'cancelado'
- guias_ids (uuid[])
- descricao (text)
- organizacao_id (uuid, FK)
- created_at
```

**contas_receber** - Contas a receber
```sql
- id (uuid, PK)
- cliente_id (uuid, FK)
- valor (numeric)
- data_vencimento (date)
- data_pagamento (date)
- tipo_pagamento (text)
- status (text) -- 'pendente', 'pago', 'cancelado'
- guias_ids (uuid[])
- descricao (text)
- organizacao_id (uuid, FK)
- created_at
```

**notifications** - Notificações
```sql
- id (uuid, PK)
- user_id (uuid, FK)
- title (text)
- message (text)
- type (text) -- 'info', 'success', 'warning', 'error'
- read_at (timestamp)
- organizacao_id (uuid, FK)
- created_at
```

### Relacionamentos Principais

```
clientes 1──N vendas
vendas 1──N vendas_servicos
vendas_servicos N──1 servicos
vendas_servicos N──1 prestadores
vendas 1──1 orcamentos (via venda_id)

vendas_servicos 1──1 guias (via venda_servico)
guias N──1 clientes
guias N──1 prestadores
guias N──1 servicos
guias 1──1 avaliacoes

prestadores 1──N servicos
prestadores N──N servicos (via servico_prestadores)

profiles 1──1 auth.users
profiles N──1 colaboradores
profiles N──1 prestadores
profiles N──1 clientes
profiles N──1 organizacoes

user_roles N──1 auth.users
user_roles N──1 organizacoes
```

### Row-Level Security (RLS)

Todas as tabelas possuem RLS habilitado. Principais políticas:

#### Funções de Segurança

```sql
-- Verifica se usuário tem role específica
public.has_role(_user_id uuid, _role app_role) → boolean

-- Verifica role do usuário atual
public.current_user_has_role(_role app_role) → boolean

-- Verifica se é admin ou gerente
public.is_admin_or_manager() → boolean

-- Retorna organizacao_id do usuário
public.get_user_organizacao_id() → uuid

-- Verifica se usuário está ativo
public.is_user_active() → boolean
```

#### Políticas Comuns

**Administradores e Gerentes** (aplicado a maioria das tabelas):
```sql
CREATE POLICY "Admins can manage [table]" ON [table]
FOR ALL TO authenticated
USING (is_admin_or_manager());
```

**Colaboradores** (leitura):
```sql
CREATE POLICY "Colaboradores podem ver [table]" ON [table]
FOR SELECT TO authenticated
USING (auth.uid() IN (SELECT id FROM profiles WHERE organizacao_id = get_user_organizacao_id()));
```

**Clientes** (seus próprios dados):
```sql
CREATE POLICY "Clientes podem ver seus [records]" ON [table]
FOR SELECT TO authenticated
USING (
  current_user_has_role('cliente'::app_role) 
  AND cliente_id IN (SELECT cliente_id FROM profiles WHERE id = auth.uid())
);
```

**Prestadores** (seus próprios dados):
```sql
CREATE POLICY "Prestadores podem ver suas [records]" ON [table]
FOR SELECT TO authenticated
USING (
  prestador_id IN (
    SELECT prestador_id FROM profiles WHERE id = auth.uid()
  )
);
```

---

## Fluxos de Dados Principais

### 1. Fluxo de Cadastro e Aprovação de Prestador

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Prestador preenche formulário de cadastro               │
│    - Dados pessoais, CNPJ, especialidades                   │
│    - Informações bancárias para repasse                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Sistema cria registro em 'prestadores'                   │
│    - Status inicial: profile.status = 'aguardando_aprovacao'│
│    - User role: 'prestador'                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Prestador vê tela "Aguardando Aprovação"                │
│    - Acesso ao portal bloqueado até aprovação               │
│    - Informações sobre próximos passos                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Admin/Gerente revisa cadastro em /aprovacoes            │
│    - Verifica documentação e dados                          │
│    - Aprova ou rejeita com motivo                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────┐
        │                                     │
        ↓                                     ↓
┌──────────────────┐              ┌──────────────────┐
│  5a. APROVADO    │              │  5b. REJEITADO   │
│  - Status: ativo │              │  - Notificação   │
│  - Acesso total  │              │  - Motivo        │
└──────────────────┘              └──────────────────┘
```

**Arquivo:** `src/pages/AprovacoesPage.tsx`, `src/pages/AguardandoAprovacao.tsx`

### 2. Fluxo de Venda Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. BUSCAR CLIENTE                                            │
│    - Busca por CPF, nome ou ID associado                    │
│    - Se não existe, permite cadastro rápido                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SELECIONAR SERVIÇOS                                       │
│    - Lista serviços disponíveis                             │
│    - Filtra por categoria, prestador                        │
│    - Adiciona múltiplos serviços ao carrinho                │
│    - Calcula valor total com descontos                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. AGENDAR SERVIÇOS                                          │
│    - Seleciona data e horário para cada serviço             │
│    - Valida disponibilidade do prestador                    │
│    - Confirma agendamentos                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PAGAMENTO                                                 │
│    - Seleciona método: PIX, Cartão, Dinheiro, Boleto       │
│    - Confirma valor total                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. FINALIZAR VENDA                                           │
│    ✓ Cria registro em 'vendas'                              │
│    ✓ Cria registros em 'vendas_servicos'                    │
│    ✓ Gera guias para cada serviço                           │
│    ✓ Envia notificações para cliente e prestadores         │
│    ✓ Atualiza status de orçamentos relacionados            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PÓS-VENDA                                                 │
│    - Cliente e prestador recebem confirmação                │
│    - Guias ficam disponíveis para impressão                 │
│    - Status inicial: 'emitida'                              │
└─────────────────────────────────────────────────────────────┘
```

**Arquivos:** 
- `src/components/vendas/NovaVendaTabWithStepper.tsx`
- `src/hooks/vendas/useVendaActions.ts`
- `src/hooks/vendas/useVendaQueries.ts`

### 3. Ciclo de Vida da Guia de Serviço

```
┌──────────────┐
│   EMITIDA    │  Guia gerada após venda
└──────┬───────┘
       │
       │ Prestador marca como realizada
       ↓
┌──────────────┐
│  REALIZADA   │  Serviço foi executado
└──────┬───────┘
       │
       │ Prestador solicita faturamento
       ↓
┌──────────────┐
│  FATURADA    │  Aguardando pagamento do hub
└──────┬───────┘
       │
       │ Admin/Gerente processa pagamento
       ↓
┌──────────────┐
│     PAGA     │  Prestador recebeu
└──────────────┘

    [Estados de exceção]
    
┌──────────────┐
│  CANCELADA   │  Serviço cancelado antes da realização
└──────────────┘

┌──────────────┐
│  ESTORNADA   │  Reembolso processado após pagamento
└──────────────┘

┌──────────────┐
│  EXPIRADA    │  Guia não utilizada no prazo
└──────────────┘
```

**Transições permitidas:**

- **Prestador pode:**
  - `emitida` → `realizada`, `cancelada`
  - `realizada` → `faturada`, `cancelada`
  - `faturada` → `cancelada`

- **Unidade (Admin/Gerente) pode:**
  - `emitida` → `cancelada`
  - `realizada` → `cancelada`
  - `faturada` → `paga`, `cancelada`, `estornada`
  - `paga` → `estornada`

**Arquivos:**
- `src/types/guias.ts` (definição de status)
- `src/hooks/guias/useGuiaStatus.ts`
- `src/components/guias/HistoricoStatusGuia.tsx`

### 4. Fluxo de Orçamento via Marketplace

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLIENTE NAVEGA MARKETPLACE                                │
│    - Busca serviços disponíveis                             │
│    - Filtra por categoria, localização, preço               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. SOLICITA ORÇAMENTO                                        │
│    - Seleciona serviço                                       │
│    - Escolhe prestador                                       │
│    - Adiciona observações                                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SISTEMA GERA ORÇAMENTO                                    │
│    ✓ Cria registro em 'orcamentos'                          │
│    ✓ Status: 'pendente'                                      │
│    ✓ Data validade: config.dias_validade_orcamento         │
│    ✓ Notifica cliente e prestador                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CLIENTE AVALIA ORÇAMENTO                                  │
│    - Visualiza detalhes do serviço                          │
│    - Revisa valor e condições                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────┴─────────────────────┐
        │                                         │
        ↓                                         ↓
┌──────────────────┐                  ┌──────────────────┐
│  5a. APROVA      │                  │  5b. REJEITA     │
└────────┬─────────┘                  │  - Status update │
         │                             └──────────────────┘
         ↓
┌──────────────────┐
│  CONVERTE VENDA  │
│  ✓ Cria venda    │
│  ✓ Gera guia     │
│  ✓ Notifica      │
└──────────────────┘
```

**Edge Function:** `supabase/functions/expirar-orcamentos/index.ts`
- Roda diariamente via cron
- Expira orçamentos com `data_validade < CURRENT_DATE`
- Envia notificações

**Arquivos:**
- `src/components/marketplace/CatalogoServicos.tsx`
- `src/components/marketplace/AprovarOrcamentoModal.tsx`
- `src/hooks/useOrcamentos.ts`

### 5. Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                     │
│    - Email + Senha                                           │
│    - Supabase Auth valida credenciais                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. BUSCAR PERFIL                                             │
│    - Query em 'profiles' por auth.uid()                     │
│    - Carrega: nivel_acesso, status, organizacao_id         │
│    - Busca roles em 'user_roles'                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDAÇÕES                                                │
│    ✓ Status = 'ativo'?                                      │
│    ✓ Requer troca de senha?                                 │
│    ✓ Prestador aguardando aprovação?                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. REDIRECT PARA PORTAL                                      │
│    - Admin/Gerente/Atendente/Colaborador → /hub            │
│    - Prestador → /provider                                   │
│    - Cliente → /client                                       │
└─────────────────────────────────────────────────────────────┘
```

**Arquivos:**
- `src/contexts/AuthContext.tsx`
- `src/contexts/auth/authOperations.ts`
- `src/contexts/auth/profileService.ts`
- `src/components/auth/PasswordChangeGuard.tsx`
- `src/pages/auth/Login.tsx`

---

## Autenticação e Autorização

### Sistema de Roles

O sistema utiliza **tabela separada de roles** (`user_roles`) para segurança:

```typescript
// Enum de roles
enum app_role {
  'admin',
  'gerente', 
  'atendente',
  'colaborador',
  'prestador',
  'cliente'
}
```

### Hierarquia de Permissões

```
admin > gerente > atendente > colaborador > prestador/cliente
```

**Admin:**
- Acesso total ao sistema
- Gerenciar todas as organizações
- Aprovar/rejeitar prestadores
- Configurar sistema

**Gerente:**
- Gerenciar sua organização
- Aprovar/rejeitar prestadores
- Acessar relatórios completos
- Gerenciar usuários da organização

**Atendente:**
- Criar vendas e orçamentos
- Gerenciar clientes
- Visualizar agendamentos
- Sem acesso a configurações

**Colaborador:**
- Registrar ponto eletrônico
- Visualizar dados básicos
- Sem permissões administrativas

**Prestador:**
- Gerenciar suas guias
- Visualizar faturamento
- Atualizar disponibilidade
- Responder avaliações

**Cliente:**
- Visualizar seus serviços
- Solicitar orçamentos
- Avaliar serviços
- Gerenciar agendamentos

### Verificação de Permissões

#### Frontend
```typescript
// Hook useAuth
const { profile, isManager, isPrestador, isActive } = useAuth();

// Guard de rota
<Route element={<AdminGuard />}>
  <Route path="aprovacoes" element={<AprovacoesPage />} />
</Route>

// Verificação inline
{isManager && (
  <Button onClick={handleApprove}>Aprovar</Button>
)}
```

#### Backend (RLS)
```sql
-- Usando função de segurança
CREATE POLICY "policy_name" ON table_name
FOR SELECT TO authenticated
USING (is_admin_or_manager());

-- Verificação de role específica
CREATE POLICY "policy_name" ON table_name
FOR SELECT TO authenticated
USING (current_user_has_role('admin'::app_role));

-- Multi-tenancy
CREATE POLICY "policy_name" ON table_name
FOR SELECT TO authenticated
USING (organizacao_id = get_user_organizacao_id());
```

### Proteção de Rotas

**Route Guards:**
- `AdminGuard`: Apenas admin/gerente
- `ManagerGuard`: Gerente ou superior
- `ProviderGuard`: Apenas prestadores
- `ClientGuard`: Apenas clientes
- `ProtectedRoute`: Qualquer autenticado

**Arquivos:**
- `src/components/layout/guards/AdminGuard.tsx`
- `src/components/layout/guards/ManagerGuard.tsx`
- `src/components/layout/guards/ProviderGuard.tsx`
- `src/components/layout/guards/ClientGuard.tsx`

---

## Guia de Contribuição

### Setup do Ambiente

#### Pré-requisitos
- Node.js 18+ ou Bun 1.0+
- Git
- Conta no Supabase (para desenvolvimento local)

#### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd agendaja

# Instale dependências
bun install
# ou
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase

# Inicie o servidor de desenvolvimento
bun dev
# ou
npm run dev
```

#### Estrutura .env
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Padrões de Código

#### TypeScript

✅ **Boas Práticas:**
```typescript
// Use types do Supabase gerados
import { Tables } from "@/integrations/supabase/types";
type Cliente = Tables<"clientes">;

// Defina interfaces para props
interface ClienteCardProps {
  cliente: Cliente;
  onEdit: (id: string) => void;
}

// Use type narrowing
if (profile?.nivel_acesso === 'admin') {
  // TypeScript sabe que é admin
}
```

❌ **Evite:**
```typescript
// Não use 'any'
const data: any = await fetchData();

// Não ignore erros de tipo
// @ts-ignore
someFunction();
```

#### React Hooks

✅ **Padrão de Custom Hook:**
```typescript
// src/hooks/useClientes.ts
export function useClientes() {
  return useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clientes")
        .select("*");
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateCliente() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cliente: TablesInsert<"clientes">) => {
      const { data, error } = await supabase
        .from("clientes")
        .insert([cliente])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });
}
```

#### Componentes

✅ **Estrutura de Componente:**
```typescript
// src/components/clientes/ClienteCard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface ClienteCardProps {
  cliente: Tables<"clientes">;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ClienteCard({ cliente, onEdit, onDelete }: ClienteCardProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{cliente.nome}</h3>
      <p className="text-sm text-muted-foreground">{cliente.cpf}</p>
      
      <div className="mt-4 flex gap-2">
        {onEdit && (
          <Button variant="outline" onClick={() => onEdit(cliente.id)}>
            Editar
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={() => onDelete(cliente.id)}>
            Excluir
          </Button>
        )}
      </div>
    </Card>
  );
}
```

#### Validação com Zod

✅ **Schema de Validação:**
```typescript
// src/lib/validations.ts
import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string()
    .length(11, "CPF deve ter 11 dígitos")
    .regex(/^\d+$/, "CPF deve conter apenas números"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().optional(),
});

export type ClienteFormData = z.infer<typeof clienteSchema>;
```

#### Estilização

✅ **Use Design Tokens:**
```typescript
// ✅ Correto - usa tokens semânticos
<div className="bg-background text-foreground">
  <h1 className="text-primary">Título</h1>
  <p className="text-muted-foreground">Descrição</p>
</div>

// ❌ Evite - cores hardcoded
<div className="bg-white text-black">
  <h1 className="text-blue-600">Título</h1>
</div>
```

**Design Tokens Disponíveis:** (ver `src/index.css`)
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`

### Git Workflow

#### Branches
```
main          # Produção
develop       # Desenvolvimento
feature/*     # Novas features
bugfix/*      # Correções
hotfix/*      # Correções urgentes
```

#### Commit Messages
Siga o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona filtro de data em orçamentos
fix: corrige cálculo de comissão em vendas
docs: atualiza documentação de API
style: formata código com prettier
refactor: reorganiza hooks de vendas
test: adiciona testes para useClientes
chore: atualiza dependências
```

#### Pull Request

**Template de PR:**
```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Nova feature
- [ ] Bug fix
- [ ] Refatoração
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] RLS policies revisadas (se aplicável)
```

### Testes

#### Estrutura de Testes
```
src/tests/
├── components/       # Testes de componentes
├── hooks/            # Testes de hooks
├── e2e/              # Testes end-to-end
├── utils/            # Testes de utilitários
└── setup.ts          # Configuração de testes
```

#### Exemplo de Teste
```typescript
// src/tests/hooks/useClientes.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useClientes } from '@/hooks/useClientes';

describe('useClientes', () => {
  it('deve buscar lista de clientes', async () => {
    const { result } = renderHook(() => useClientes());
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    
    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
```

### Documentação de Código

#### JSDoc para Funções Complexas
```typescript
/**
 * Calcula o valor final do orçamento aplicando desconto
 * @param valorBase - Valor base do serviço
 * @param percentualDesconto - Percentual de desconto (0-100)
 * @returns Valor final com desconto aplicado
 * @throws {Error} Se percentual for inválido
 */
export function calcularValorFinal(
  valorBase: number, 
  percentualDesconto: number
): number {
  if (percentualDesconto < 0 || percentualDesconto > 100) {
    throw new Error("Percentual deve estar entre 0 e 100");
  }
  return valorBase * (1 - percentualDesconto / 100);
}
```

### Code Review Guidelines

**O que revisar:**
- [ ] Código segue padrões do projeto
- [ ] Types TypeScript corretos
- [ ] RLS policies adequadas (se toca DB)
- [ ] Tratamento de erros implementado
- [ ] Loading states e feedback UX
- [ ] Responsividade mobile
- [ ] Performance (evitar re-renders, memo quando necessário)
- [ ] Acessibilidade (aria-labels, keyboard navigation)

---

## Deploy e Ambiente

### Ambientes

**Desenvolvimento Local:**
- URL: `http://localhost:5173`
- Supabase: projeto de desenvolvimento
- Hot reload habilitado

**Staging:**
- Hospedagem: Lovable.dev
- Supabase: projeto de staging
- Sincronização com branch `develop`

**Produção:**
- Hospedagem: Lovable.dev (ou custom domain)
- Supabase: projeto de produção
- Sincronização com branch `main`

### Build

```bash
# Build de produção
bun run build

# Preview do build
bun run preview

# Type check
bun run type-check
```

### Variáveis de Ambiente

**Desenvolvimento:**
```bash
# .env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

**Produção:**
Configuradas no painel do Lovable.dev ou plataforma de deploy.

### Supabase Edge Functions

**Deploy de Edge Functions:**
```bash
# Deploy todas as functions
supabase functions deploy

# Deploy function específica
supabase functions deploy expirar-orcamentos

# Ver logs
supabase functions logs expirar-orcamentos
```

**Cron Jobs (configurado no Supabase):**
```sql
-- Expira orçamentos diariamente às 00:00 UTC
SELECT cron.schedule(
  'expirar-orcamentos',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://[project-id].supabase.co/functions/v1/expirar-orcamentos',
    headers := jsonb_build_object('Authorization', 'Bearer [service-role-key]'),
    body := '{}'::jsonb
  )
  $$
);
```

### Monitoramento

**Supabase Dashboard:**
- Database: Logs, performance, queries
- Auth: Usuários, sessions, logs
- Storage: Uso de storage
- Edge Functions: Invocações, logs, erros

**Frontend:**
- Lovable Analytics
- Console logs (desenvolvimento)
- Error boundaries para crash recovery

### Backup

**Banco de Dados:**
- Backup automático diário (Supabase)
- Point-in-time recovery disponível
- Export manual via Supabase Dashboard

**Código:**
- Versionamento Git
- GitHub/GitLab como repositório remoto
- Tags para releases

---

## Troubleshooting

### Problemas Comuns

#### 1. Erro de autenticação "User not found"
**Causa:** Profile não foi criado para o usuário.
**Solução:** Verificar trigger `handle_new_user()` no Supabase.

#### 2. RLS Policy blocking query
**Causa:** Política RLS impedindo acesso.
**Solução:** 
- Verificar se usuário tem role correta em `user_roles`
- Revisar políticas da tabela no Supabase Dashboard
- Usar `USING (true)` temporariamente para debug

#### 3. React Query não atualiza após mutation
**Causa:** `invalidateQueries` não chamado ou queryKey incorreta.
**Solução:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["clientes"] });
}
```

#### 4. Build failure: Type error
**Causa:** Types do Supabase desatualizados.
**Solução:**
```bash
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

#### 5. Edge Function timeout
**Causa:** Função excede 60s de execução.
**Solução:** Otimizar query, processar em lotes, ou usar queue system.

---

## Recursos Adicionais

### Links Úteis

- **Supabase Docs:** https://supabase.com/docs
- **React Query Docs:** https://tanstack.com/query/latest
- **Shadcn/ui:** https://ui.shadcn.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Zod:** https://zod.dev/

### Contato

Para dúvidas ou suporte:
- **Email:** [contato@agendaja.com]
- **Slack:** [workspace-link]
- **Issues:** [GitHub Issues]

---

**Última atualização:** 2024-01-XX  
**Versão:** 1.0.0
