
-- Criar tabela de relacionamento entre serviços e prestadores
CREATE TABLE public.servico_prestadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE CASCADE,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(servico_id, prestador_id)
);

-- Índices para performance
CREATE INDEX idx_servico_prestadores_servico ON public.servico_prestadores(servico_id);
CREATE INDEX idx_servico_prestadores_prestador ON public.servico_prestadores(prestador_id);

-- RLS para a nova tabela
ALTER TABLE public.servico_prestadores ENABLE ROW LEVEL SECURITY;

-- Política básica para colaboradores verem todos os relacionamentos
CREATE POLICY "Colaboradores podem ver todos os relacionamentos" 
  ON public.servico_prestadores 
  FOR ALL 
  USING (true);
