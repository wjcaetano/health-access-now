
-- =================
-- CLIENTES
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  endereco TEXT,
  data_cadastro TIMESTAMP DEFAULT now(),
  id_associado TEXT NOT NULL UNIQUE
);

-- =================
-- PRESTADORES (clínicas, laboratórios, profissionais)
CREATE TABLE public.prestadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('clinica', 'laboratorio', 'profissional')),
  especialidades TEXT[], -- array para múltiplas especialidades
  cnpj TEXT NOT NULL UNIQUE,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT CHECK (tipo_conta IN ('corrente', 'poupanca')),
  comissao DECIMAL(5,2) DEFAULT 0, -- percentual de comissão
  data_cadastro TIMESTAMP DEFAULT now(),
  ativo BOOLEAN DEFAULT TRUE
);

-- =================
-- SERVIÇOS
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE CASCADE,
  valor_custo DECIMAL(10,2) NOT NULL,
  valor_venda DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  tempo_estimado TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- AGENDAMENTOS
CREATE TABLE public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES public.servicos(id),
  prestador_id UUID REFERENCES public.prestadores(id),
  data_agendamento DATE NOT NULL,
  horario TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'realizado')),
  codigo_autenticacao TEXT NOT NULL UNIQUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- ORÇAMENTOS
CREATE TABLE public.orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES public.servicos(id),
  prestador_id UUID REFERENCES public.prestadores(id),
  valor_custo DECIMAL(10,2) NOT NULL,
  valor_venda DECIMAL(10,2) NOT NULL,
  percentual_desconto DECIMAL(5,2) DEFAULT 0,
  valor_final DECIMAL(10,2) NOT NULL,
  data_validade DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'aprovado', 'recusado', 'expirado')),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- GUIAS
CREATE TABLE public.guias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID REFERENCES public.agendamentos(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id),
  prestador_id UUID REFERENCES public.prestadores(id),
  servico_id UUID REFERENCES public.servicos(id),
  valor DECIMAL(10,2) NOT NULL,
  codigo_autenticacao TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('emitida', 'realizada', 'faturada', 'paga')),
  data_emissao TIMESTAMP DEFAULT now(),
  data_realizacao TIMESTAMP,
  data_faturamento TIMESTAMP,
  data_pagamento TIMESTAMP
);

-- =================
-- CONTAS A PAGAR (para prestadores)
CREATE TABLE public.contas_pagar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES public.prestadores(id),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'cancelado')),
  descricao TEXT,
  guias_ids UUID[], -- array de IDs das guias relacionadas
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- CONTAS A RECEBER (de clientes)
CREATE TABLE public.contas_receber (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id),
  valor DECIMAL(10,2) NOT NULL,
  tipo_pagamento TEXT CHECK (tipo_pagamento IN ('pix', 'cartao', 'dinheiro', 'boleto')),
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'pago', 'cancelado')),
  descricao TEXT,
  guias_ids UUID[], -- array de IDs das guias relacionadas
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- MENSAGENS (WhatsApp/Chat)
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id),
  colaborador_id UUID REFERENCES public.colaboradores(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('recebida', 'enviada', 'ia')),
  texto TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- =================
-- AGENDA DE PAGAMENTOS (para prestadores escolherem datas)
CREATE TABLE public.agenda_pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES public.prestadores(id),
  data_escolhida DATE NOT NULL,
  mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(prestador_id, mes, ano) -- cada prestador só pode escolher uma data por mês
);

-- =================
-- ÍNDICES para performance
CREATE INDEX idx_agendamentos_data ON public.agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_cliente ON public.agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_prestador ON public.agendamentos(prestador_id);
CREATE INDEX idx_guias_status ON public.guias(status);
CREATE INDEX idx_mensagens_cliente ON public.mensagens(cliente_id);
CREATE INDEX idx_mensagens_timestamp ON public.mensagens(created_at);
CREATE INDEX idx_servicos_prestador ON public.servicos(prestador_id);
CREATE INDEX idx_orcamentos_cliente ON public.orcamentos(cliente_id);

-- =================
-- RLS (Row Level Security) - Exemplos básicos
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (podem ser refinadas posteriormente)
CREATE POLICY "Colaboradores podem ver todos os dados" ON public.clientes FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver todos os prestadores" ON public.prestadores FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver todos os serviços" ON public.servicos FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver todos os agendamentos" ON public.agendamentos FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver todos os orçamentos" ON public.orcamentos FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver todas as guias" ON public.guias FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver contas a pagar" ON public.contas_pagar FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver contas a receber" ON public.contas_receber FOR ALL USING (true);
CREATE POLICY "Colaboradores podem ver mensagens" ON public.mensagens FOR ALL USING (true);
CREATE POLICY "Prestadores podem ver sua agenda" ON public.agenda_pagamentos FOR ALL USING (true);
