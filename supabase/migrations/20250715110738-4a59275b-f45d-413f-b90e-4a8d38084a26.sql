
-- Criar tabelas para o sistema de franquias

-- Tabela de franquias/unidades
CREATE TABLE public.franquias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_fantasia TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  endereco_completo TEXT NOT NULL,
  cep TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  data_inauguracao DATE,
  status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa', 'suspensa', 'em_implantacao')),
  tipo_franquia TEXT NOT NULL DEFAULT 'tradicional' CHECK (tipo_franquia IN ('tradicional', 'master', 'microfranquia')),
  valor_investimento NUMERIC(12,2),
  taxa_royalty NUMERIC(5,2) DEFAULT 5.00,
  taxa_marketing NUMERIC(5,2) DEFAULT 2.00,
  meta_mensal NUMERIC(12,2),
  territorio_exclusivo TEXT,
  franqueado_responsavel_id UUID,
  data_cadastro TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de franqueados
CREATE TABLE public.franqueados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_completo TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  rg TEXT,
  data_nascimento DATE,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  endereco_completo TEXT,
  experiencia_empresarial TEXT,
  capital_disponivel NUMERIC(12,2),
  referencias TEXT,
  status TEXT NOT NULL DEFAULT 'prospecto' CHECK (status IN ('prospecto', 'qualificado', 'em_negociacao', 'aprovado', 'ativo', 'inativo')),
  score_credito INTEGER CHECK (score_credito >= 0 AND score_credito <= 1000),
  data_primeiro_contato DATE DEFAULT CURRENT_DATE,
  origem_lead TEXT CHECK (origem_lead IN ('site', 'indicacao', 'feira', 'marketing_digital', 'telemarketing', 'outros')),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de relacionamento franquia-franqueado
CREATE TABLE public.franquia_franqueados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franquia_id UUID NOT NULL REFERENCES public.franquias(id) ON DELETE CASCADE,
  franqueado_id UUID NOT NULL REFERENCES public.franqueados(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  percentual_participacao NUMERIC(5,2) DEFAULT 100.00,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de royalties
CREATE TABLE public.royalties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franquia_id UUID NOT NULL REFERENCES public.franquias(id) ON DELETE CASCADE,
  mes_referencia INTEGER NOT NULL CHECK (mes_referencia >= 1 AND mes_referencia <= 12),
  ano_referencia INTEGER NOT NULL,
  faturamento_bruto NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_royalty NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_marketing NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado', 'isento')),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(franquia_id, mes_referencia, ano_referencia)
);

-- Tabela de leads de franqueados
CREATE TABLE public.leads_franqueados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  cidade_interesse TEXT,
  estado_interesse TEXT,
  capital_disponivel NUMERIC(12,2),
  experiencia_empresarial TEXT,
  origem TEXT CHECK (origem IN ('site', 'facebook', 'google', 'indicacao', 'feira', 'outros')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'qualificado', 'apresentacao', 'proposta', 'aprovado', 'rejeitado', 'perdido')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  data_primeiro_contato TIMESTAMP,
  responsavel_id UUID,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de acompanhamento de leads
CREATE TABLE public.lead_acompanhamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads_franqueados(id) ON DELETE CASCADE,
  tipo_contato TEXT NOT NULL CHECK (tipo_contato IN ('telefone', 'email', 'whatsapp', 'presencial', 'videochamada')),
  data_contato TIMESTAMP NOT NULL DEFAULT NOW(),
  responsavel_id UUID NOT NULL,
  resumo TEXT NOT NULL,
  proximo_contato DATE,
  status_anterior TEXT,
  status_novo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de metas da franqueadora
CREATE TABLE public.metas_franqueadora (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo_meta TEXT NOT NULL CHECK (tipo_meta IN ('vendas_franquias', 'royalties', 'unidades_ativas', 'leads_qualificados')),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL,
  valor_meta NUMERIC(12,2) NOT NULL,
  valor_realizado NUMERIC(12,2) DEFAULT 0,
  percentual_atingido NUMERIC(5,2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tipo_meta, mes, ano)
);

-- Tabela de contratos de franquia
CREATE TABLE public.contratos_franquia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franquia_id UUID NOT NULL REFERENCES public.franquias(id) ON DELETE CASCADE,
  numero_contrato TEXT NOT NULL UNIQUE,
  data_assinatura DATE NOT NULL,
  data_inicio DATE NOT NULL,
  data_vencimento DATE NOT NULL,
  valor_inicial NUMERIC(12,2) NOT NULL,
  taxa_royalty NUMERIC(5,2) NOT NULL,
  taxa_marketing NUMERIC(5,2) NOT NULL,
  territorio TEXT,
  clausulas_especiais TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'vencido', 'rescindido', 'renovado')),
  arquivo_contrato_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Adicionar foreign key para franqueado responsável
ALTER TABLE public.franquias 
ADD CONSTRAINT fk_franquia_responsavel 
FOREIGN KEY (franqueado_responsavel_id) REFERENCES public.franqueados(id);

-- Habilitar RLS
ALTER TABLE public.franquias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franqueados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franquia_franqueados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.royalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_franqueados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_acompanhamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metas_franqueadora ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos_franquia ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para administradores
CREATE POLICY "Admins can manage franquias" ON public.franquias FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage franqueados" ON public.franqueados FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage franquia_franqueados" ON public.franquia_franqueados FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage royalties" ON public.royalties FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage leads_franqueados" ON public.leads_franqueados FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage lead_acompanhamentos" ON public.lead_acompanhamentos FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage metas_franqueadora" ON public.metas_franqueadora FOR ALL USING (is_admin_or_manager());
CREATE POLICY "Admins can manage contratos_franquia" ON public.contratos_franquia FOR ALL USING (is_admin_or_manager());

-- Índices para performance
CREATE INDEX idx_franquias_status ON public.franquias(status);
CREATE INDEX idx_franqueados_status ON public.franqueados(status);
CREATE INDEX idx_royalties_vencimento ON public.royalties(data_vencimento);
CREATE INDEX idx_royalties_status ON public.royalties(status);
CREATE INDEX idx_leads_status ON public.leads_franqueados(status);
CREATE INDEX idx_leads_score ON public.leads_franqueados(score);

-- Views para relatórios
CREATE VIEW public.view_franquias_resumo AS
SELECT 
  f.id,
  f.nome_fantasia,
  f.cidade,
  f.estado,
  f.status,
  f.tipo_franquia,
  f.data_inauguracao,
  fr.nome_completo as franqueado_nome,
  fr.email as franqueado_email,
  COUNT(DISTINCT c.id) as total_clientes,
  COUNT(DISTINCT v.id) as total_vendas,
  COALESCE(SUM(v.valor_total), 0) as faturamento_total,
  (SELECT COUNT(*) FROM royalties r WHERE r.franquia_id = f.id AND r.status = 'atrasado') as royalties_atrasados
FROM franquias f
LEFT JOIN franqueados fr ON f.franqueado_responsavel_id = fr.id
LEFT JOIN profiles p ON p.prestador_id IS NULL -- Assumindo que clientes da franquia não têm prestador_id
LEFT JOIN clientes c ON true -- Precisaríamos de um campo franquia_id em clientes
LEFT JOIN vendas v ON v.cliente_id = c.id
GROUP BY f.id, f.nome_fantasia, f.cidade, f.estado, f.status, f.tipo_franquia, f.data_inauguracao, fr.nome_completo, fr.email;

-- Triggers para atualizar timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_franquias_updated_at BEFORE UPDATE ON public.franquias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_franqueados_updated_at BEFORE UPDATE ON public.franqueados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads_franqueados FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metas_updated_at BEFORE UPDATE ON public.metas_franqueadora FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
