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