
-- Criar tabela de vendas
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id) NOT NULL,
  valor_total NUMERIC NOT NULL,
  metodo_pagamento TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'concluida',
  observacoes TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens de venda (serviços vendidos)
CREATE TABLE public.vendas_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID REFERENCES public.vendas(id) ON DELETE CASCADE NOT NULL,
  servico_id UUID REFERENCES public.servicos(id) NOT NULL,
  prestador_id UUID REFERENCES public.prestadores(id) NOT NULL,
  valor NUMERIC NOT NULL,
  data_agendamento DATE,
  horario TIME,
  status TEXT NOT NULL DEFAULT 'vendido',
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar coluna venda_id na tabela orcamentos para vincular orçamentos às vendas
ALTER TABLE public.orcamentos ADD COLUMN venda_id UUID REFERENCES public.vendas(id);

-- Criar índices para melhor performance
CREATE INDEX idx_vendas_cliente_id ON public.vendas(cliente_id);
CREATE INDEX idx_vendas_servicos_venda_id ON public.vendas_servicos(venda_id);
CREATE INDEX idx_vendas_servicos_servico_id ON public.vendas_servicos(servico_id);
CREATE INDEX idx_orcamentos_venda_id ON public.orcamentos(venda_id);
CREATE INDEX idx_orcamentos_cliente_status ON public.orcamentos(cliente_id, status);
