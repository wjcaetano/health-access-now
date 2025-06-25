
-- Verificar e corrigir a constraint de status dos orçamentos
ALTER TABLE public.orcamentos DROP CONSTRAINT IF EXISTS orcamentos_status_check;

-- Adicionar nova constraint que aceita todos os status necessários
ALTER TABLE public.orcamentos ADD CONSTRAINT orcamentos_status_check 
CHECK (status IN ('pendente', 'aprovado', 'cancelado', 'expirado', 'convertido'));
