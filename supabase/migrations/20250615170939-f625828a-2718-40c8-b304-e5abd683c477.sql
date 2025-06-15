
-- =================
-- 1. COLABORADORES (usuários do sistema)
CREATE TABLE public.colaboradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  nivel_acesso TEXT NOT NULL CHECK (nivel_acesso IN ('colaborador', 'atendente', 'gerente', 'admin')),
  cargo TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  data_cadastro TIMESTAMP DEFAULT now()
);

-- 2. PONTO ELETRÔNICO
CREATE TABLE public.ponto_eletronico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id UUID REFERENCES public.colaboradores(id) ON DELETE CASCADE,
  data_ponto DATE NOT NULL,
  hora_entrada TIMESTAMP,
  hora_saida TIMESTAMP,
  tipo_ponto TEXT NOT NULL CHECK (tipo_ponto IN ('entrada', 'saida')),
  observacao TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 3. Exemplo de política sugerida (RLS): cada colaborador só pode ver/bater seu próprio ponto.
ALTER TABLE public.ponto_eletronico ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada colaborador pode acessar apenas seus próprios pontos"
ON public.ponto_eletronico
FOR SELECT
USING (auth.uid()::UUID = colaborador_id);

CREATE POLICY "Cada colaborador pode registrar seu próprio ponto"
ON public.ponto_eletronico
FOR INSERT
WITH CHECK (auth.uid()::UUID = colaborador_id);

-- Admin pode tudo (exemplo)
-- (se desejar liberar para admin visualizar todo o ponto, precisaríamos de função definidora de segurança e tabela de usuários vinculada ao auth do Supabase)

-- 4. Relacione com outras tabelas conforme expandir sistema:
-- Exemplo de possíveis tabelas extras:
-- clientes, prestadores, agendamentos, etc (caso deseje ativar posteriormente)

