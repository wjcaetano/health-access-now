-- Primeiro, vamos fazer a renomeação das tabelas e colunas em lotes menores

-- 1. Remover tabelas relacionadas a franquias
DROP TABLE IF EXISTS public.franquia_franqueados CASCADE;
DROP TABLE IF EXISTS public.leads_franqueados CASCADE;
DROP TABLE IF EXISTS public.lead_acompanhamentos CASCADE;
DROP TABLE IF EXISTS public.franqueados CASCADE;
DROP TABLE IF EXISTS public.franquias CASCADE;
DROP TABLE IF EXISTS public.royalties CASCADE;
DROP TABLE IF EXISTS public.metas_franqueadora CASCADE;
DROP TABLE IF EXISTS public.contratos_franquia CASCADE;
DROP VIEW IF EXISTS public.view_franquias_resumo CASCADE;

-- 2. Renomear a tabela tenants para unidades
ALTER TABLE public.tenants RENAME TO unidades;

-- 3. Renomear colunas na tabela unidades
ALTER TABLE public.unidades RENAME COLUMN tenant_pai_id TO unidade_matriz_id;

-- 4. Atualizar tipo padrão
ALTER TABLE public.unidades ALTER COLUMN tipo SET DEFAULT 'filial';

-- 5. Adicionar colunas específicas para unidades
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS gerente_responsavel_id uuid;
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS meta_mensal_vendas numeric DEFAULT 0;
ALTER TABLE public.unidades ADD COLUMN IF NOT EXISTS horario_funcionamento jsonb DEFAULT '{"segunda": {"abertura": "08:00", "fechamento": "18:00"}, "terca": {"abertura": "08:00", "fechamento": "18:00"}, "quarta": {"abertura": "08:00", "fechamento": "18:00"}, "quinta": {"abertura": "08:00", "fechamento": "18:00"}, "sexta": {"abertura": "08:00", "fechamento": "18:00"}, "sabado": {"abertura": "08:00", "fechamento": "14:00"}, "domingo": {"fechado": true}}'::jsonb;