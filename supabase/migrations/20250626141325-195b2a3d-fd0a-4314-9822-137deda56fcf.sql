
-- Migration para limpar dados de vendas, guias e orçamentos
-- ATENÇÃO: Esta operação irá deletar TODOS os dados das tabelas relacionadas

-- Limpar tabela de vendas_servicos (dependente de vendas)
DELETE FROM public.vendas_servicos;

-- Limpar tabela de guias
DELETE FROM public.guias;

-- Limpar tabela de orçamentos
DELETE FROM public.orcamentos;

-- Limpar tabela de vendas
DELETE FROM public.vendas;
