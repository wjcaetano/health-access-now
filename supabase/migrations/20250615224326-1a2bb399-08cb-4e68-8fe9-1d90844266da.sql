
-- Adicionar campo de status de trabalho na tabela colaboradores
ALTER TABLE public.colaboradores ADD COLUMN status_trabalho TEXT DEFAULT 'fora_trabalho' CHECK (status_trabalho IN ('trabalhando', 'fora_trabalho'));

-- Adicionar índice para melhor performance nas consultas de ponto
CREATE INDEX idx_ponto_colaborador_data ON public.ponto_eletronico(colaborador_id, data_ponto);

-- Função para verificar último ponto do colaborador
CREATE OR REPLACE FUNCTION public.get_ultimo_ponto_colaborador(colaborador_uuid UUID)
RETURNS TABLE (
  tipo_ponto TEXT,
  data_ponto DATE,
  created_at TIMESTAMP
)
LANGUAGE sql
STABLE
AS $$
  SELECT p.tipo_ponto, p.data_ponto, p.created_at
  FROM public.ponto_eletronico p
  WHERE p.colaborador_id = colaborador_uuid
  ORDER BY p.data_ponto DESC, p.created_at DESC
  LIMIT 1;
$$;

-- Função para verificar se colaborador já bateu ponto hoje
CREATE OR REPLACE FUNCTION public.ja_bateu_ponto_hoje(colaborador_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ponto_eletronico p
    WHERE p.colaborador_id = colaborador_uuid
    AND p.data_ponto = CURRENT_DATE
    AND p.tipo_ponto = 'entrada'
  );
$$;

-- Trigger para atualizar status do colaborador quando bater ponto
CREATE OR REPLACE FUNCTION public.atualizar_status_colaborador()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tipo_ponto = 'entrada' THEN
    UPDATE public.colaboradores 
    SET status_trabalho = 'trabalhando'
    WHERE id = NEW.colaborador_id;
  ELSIF NEW.tipo_ponto = 'saida' THEN
    UPDATE public.colaboradores 
    SET status_trabalho = 'fora_trabalho'
    WHERE id = NEW.colaborador_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger
CREATE TRIGGER trigger_atualizar_status_colaborador
  AFTER INSERT ON public.ponto_eletronico
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_status_colaborador();
