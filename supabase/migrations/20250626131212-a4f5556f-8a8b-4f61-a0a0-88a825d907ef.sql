
-- Adicionar as colunas necessárias para controle de cancelamento e estorno
ALTER TABLE public.guias 
ADD COLUMN IF NOT EXISTS data_cancelamento timestamp without time zone,
ADD COLUMN IF NOT EXISTS data_estorno timestamp without time zone;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_guias_agendamento_id ON public.guias(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_guias_status ON public.guias(status);
