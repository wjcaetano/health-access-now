-- =====================================================
-- Migration: Remove Tenant/Franchise Structure
-- Objetivo: Transformar de multi-tenant para SaaS centralizado
-- =====================================================

-- 1. Remover colunas relacionadas a franquia/matriz
ALTER TABLE unidades DROP COLUMN IF EXISTS unidade_matriz_id CASCADE;
ALTER TABLE unidades DROP COLUMN IF EXISTS tipo CASCADE;
ALTER TABLE unidades DROP COLUMN IF EXISTS meta_mensal_vendas CASCADE;
ALTER TABLE unidades DROP COLUMN IF EXISTS gerente_responsavel_id CASCADE;

-- 2. Renomear tabela unidades para organizacoes
ALTER TABLE unidades RENAME TO organizacoes;

-- 3. Adicionar tipo_organizacao (clinica, laboratorio, prestador_pj)
ALTER TABLE organizacoes ADD COLUMN IF NOT EXISTS tipo_organizacao TEXT NOT NULL DEFAULT 'clinica';
ALTER TABLE organizacoes ADD CONSTRAINT check_tipo_organizacao 
  CHECK (tipo_organizacao IN ('clinica', 'laboratorio', 'prestador_pessoa_juridica'));

-- 4. Renomear unidade_id para organizacao_id em todas as tabelas
ALTER TABLE clientes RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE prestadores RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE servicos RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE vendas RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE vendas_servicos RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE agendamentos RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE orcamentos RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE guias RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE contas_pagar RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE contas_receber RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE agenda_pagamentos RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE mensagens RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE colaboradores RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE ponto_eletronico RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE notifications RENAME COLUMN unidade_id TO organizacao_id;
ALTER TABLE profiles RENAME COLUMN unidade_id TO organizacao_id;

-- 5. Dropar tabela de convites de unidade (não faz mais sentido)
DROP TABLE IF EXISTS unidade_invites CASCADE;

-- 6. Remover funções RLS antigas de tenant
DROP FUNCTION IF EXISTS get_user_tenant_id() CASCADE;
DROP FUNCTION IF EXISTS user_has_tenant_access(uuid) CASCADE;
DROP FUNCTION IF EXISTS set_tenant_id() CASCADE;

-- 7. Criar nova função para pegar organizacao do usuário
CREATE OR REPLACE FUNCTION public.get_user_organizacao_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organizacao_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 8. Atualizar função get_user_unidade_id para usar organizacao_id
DROP FUNCTION IF EXISTS get_user_unidade_id() CASCADE;
CREATE OR REPLACE FUNCTION public.get_user_unidade_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organizacao_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 9. Atualizar trigger set_unidade_id para usar organizacao_id
DROP FUNCTION IF EXISTS set_unidade_id() CASCADE;
CREATE OR REPLACE FUNCTION public.set_unidade_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.organizacao_id IS NULL THEN
    NEW.organizacao_id := public.get_user_organizacao_id();
  END IF;
  RETURN NEW;
END;
$$;

-- 10. Comentários para documentação
COMMENT ON TABLE organizacoes IS 'Organizações parceiras no hub: clínicas, laboratórios e prestadores PJ';
COMMENT ON COLUMN organizacoes.tipo_organizacao IS 'Tipo da organização: clinica, laboratorio ou prestador_pessoa_juridica';