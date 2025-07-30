-- Criar um tenant padrão com tipo válido
INSERT INTO public.tenants (nome, codigo, tipo, status)
VALUES ('Sistema Principal', 'MAIN', 'unidade', 'ativo')
ON CONFLICT (codigo) DO NOTHING;

-- Atualizar todos os profiles que não têm tenant_id para usar o tenant padrão
UPDATE public.profiles 
SET tenant_id = (SELECT id FROM public.tenants WHERE codigo = 'MAIN' LIMIT 1)
WHERE tenant_id IS NULL;

-- Atualizar todas as tabelas que têm tenant_id nulo para usar o tenant padrão
DO $$
DECLARE
    default_tenant_id uuid;
BEGIN
    -- Buscar o ID do tenant padrão
    SELECT id INTO default_tenant_id FROM public.tenants WHERE codigo = 'MAIN' LIMIT 1;
    
    IF default_tenant_id IS NOT NULL THEN
        -- Atualizar todas as tabelas com tenant_id
        UPDATE public.clientes SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.prestadores SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.servicos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.vendas SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.vendas_servicos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.agendamentos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.orcamentos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.guias SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.mensagens SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.contas_pagar SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.contas_receber SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.agenda_pagamentos SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.ponto_eletronico SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.colaboradores SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
        UPDATE public.notifications SET tenant_id = default_tenant_id WHERE tenant_id IS NULL;
    END IF;
END $$;