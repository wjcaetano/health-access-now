-- Remover tabelas relacionadas a franquias que não serão usadas
DROP TABLE IF EXISTS public.franquia_franqueados CASCADE;
DROP TABLE IF EXISTS public.leads_franqueados CASCADE;
DROP TABLE IF EXISTS public.lead_acompanhamentos CASCADE;
DROP TABLE IF EXISTS public.franqueados CASCADE;
DROP TABLE IF EXISTS public.franquias CASCADE;
DROP TABLE IF EXISTS public.royalties CASCADE;
DROP TABLE IF EXISTS public.metas_franqueadora CASCADE;
DROP TABLE IF EXISTS public.contratos_franquia CASCADE;
DROP VIEW IF EXISTS public.view_franquias_resumo CASCADE;

-- Renomear a tabela tenants para unidades (mais apropriado)
ALTER TABLE public.tenants RENAME TO unidades;

-- Atualizar comentários e descrições
COMMENT ON TABLE public.unidades IS 'Tabela que armazena as diferentes unidades da empresa em várias cidades';

-- Renomear a coluna tenant_pai_id para unidade_matriz_id (caso haja uma unidade central)
ALTER TABLE public.unidades RENAME COLUMN tenant_pai_id TO unidade_matriz_id;

-- Atualizar tipo para refletir que são unidades, não franquias
ALTER TABLE public.unidades ALTER COLUMN tipo SET DEFAULT 'filial';

-- Adicionar colunas específicas para unidades (não franquias)
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS gerente_responsavel_id uuid;
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS meta_mensal_vendas numeric DEFAULT 0;
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS horario_funcionamento jsonb DEFAULT '{"segunda": {"abertura": "08:00", "fechamento": "18:00"}, "terca": {"abertura": "08:00", "fechamento": "18:00"}, "quarta": {"abertura": "08:00", "fechamento": "18:00"}, "quinta": {"abertura": "08:00", "fechamento": "18:00"}, "sexta": {"abertura": "08:00", "fechamento": "18:00"}, "sabado": {"abertura": "08:00", "fechamento": "14:00"}, "domingo": {"fechado": true}}'::jsonb;

-- Atualizar funções para usar 'unidades' em vez de 'tenants'
CREATE OR REPLACE FUNCTION public.get_user_unidade_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT unidade_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.user_has_unidade_access(target_unidade_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.unidades u ON (p.unidade_id = u.id OR p.unidade_id = u.unidade_matriz_id OR u.unidade_matriz_id = p.unidade_id)
    WHERE p.id = auth.uid() 
    AND (u.id = target_unidade_id OR p.unidade_id = target_unidade_id)
  );
$$;

-- Atualizar trigger para usar nova função
CREATE OR REPLACE FUNCTION public.set_unidade_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.unidade_id IS NULL THEN
    NEW.unidade_id := public.get_user_unidade_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Renomear colunas tenant_id para unidade_id em todas as tabelas
ALTER TABLE public.profiles RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.clientes RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.prestadores RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.servicos RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.agendamentos RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.vendas RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.vendas_servicos RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.orcamentos RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.guias RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.mensagens RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.colaboradores RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.ponto_eletronico RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.contas_pagar RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.contas_receber RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.agenda_pagamentos RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.notifications RENAME COLUMN tenant_id TO unidade_id;
ALTER TABLE public.tenant_invites RENAME COLUMN tenant_id TO unidade_id;

-- Renomear tabela de convites
ALTER TABLE public.tenant_invites RENAME TO unidade_invites;

-- Atualizar políticas RLS para usar as novas funções
-- Exemplo para tabela clientes
DROP POLICY IF EXISTS "Users can view clients in their tenant" ON public.clientes;
CREATE POLICY "Users can view clients in their unidade" 
ON public.clientes 
FOR SELECT 
USING (user_has_unidade_access(unidade_id));

DROP POLICY IF EXISTS "Users can create clients in their tenant" ON public.clientes;
CREATE POLICY "Users can create clients in their unidade" 
ON public.clientes 
FOR INSERT 
WITH CHECK (unidade_id = get_user_unidade_id());

DROP POLICY IF EXISTS "Users can update clients in their tenant" ON public.clientes;
CREATE POLICY "Users can update clients in their unidade" 
ON public.clientes 
FOR UPDATE 
USING (user_has_unidade_access(unidade_id));

-- Inserir unidades exemplo (matriz e filiais)
INSERT INTO public.unidades (nome, codigo, tipo, status) VALUES 
('Matriz - São Paulo', 'SP001', 'matriz', 'ativo'),
('Filial - Rio de Janeiro', 'RJ001', 'filial', 'ativo'),
('Filial - Belo Horizonte', 'MG001', 'filial', 'ativo')
ON CONFLICT DO NOTHING;