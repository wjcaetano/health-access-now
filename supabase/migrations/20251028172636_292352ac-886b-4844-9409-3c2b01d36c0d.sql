-- Migration: Fase 4 - Sistema de Avaliações e Melhorias em Prestadores

-- 1. Adicionar novas colunas na tabela prestadores
ALTER TABLE public.prestadores 
ADD COLUMN IF NOT EXISTS localizacao TEXT,
ADD COLUMN IF NOT EXISTS disponibilidade TEXT DEFAULT 'disponivel',
ADD COLUMN IF NOT EXISTS media_avaliacoes NUMERIC(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_avaliacoes INTEGER DEFAULT 0;

-- 2. Criar constraint para disponibilidade
ALTER TABLE public.prestadores 
ADD CONSTRAINT check_disponibilidade 
CHECK (disponibilidade IN ('disponivel', 'indisponivel', 'ocupado'));

-- 3. Criar tabela de avaliações
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
  prestador_id UUID REFERENCES public.prestadores(id) ON DELETE CASCADE NOT NULL,
  guia_id UUID REFERENCES public.guias(id) ON DELETE CASCADE NOT NULL,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  resposta_prestador TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  organizacao_id UUID REFERENCES public.organizacoes(id),
  UNIQUE (guia_id)
);

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_prestador ON public.avaliacoes(prestador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_cliente ON public.avaliacoes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_nota ON public.avaliacoes(nota);
CREATE INDEX IF NOT EXISTS idx_prestadores_localizacao ON public.prestadores(localizacao);
CREATE INDEX IF NOT EXISTS idx_prestadores_disponibilidade ON public.prestadores(disponibilidade);
CREATE INDEX IF NOT EXISTS idx_prestadores_media_avaliacoes ON public.prestadores(media_avaliacoes);

-- 5. Enable RLS na tabela avaliacoes
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- 6. Políticas RLS para avaliacoes
CREATE POLICY "Todos podem ver avaliações"
  ON public.avaliacoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clientes podem criar avaliações de seus serviços"
  ON public.avaliacoes FOR INSERT
  TO authenticated
  WITH CHECK (
    cliente_id IN (
      SELECT c.id FROM public.clientes c
      JOIN public.profiles p ON p.organizacao_id = c.organizacao_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Prestadores podem responder suas avaliações"
  ON public.avaliacoes FOR UPDATE
  TO authenticated
  USING (
    prestador_id IN (
      SELECT p.id FROM public.prestadores p
      JOIN public.profiles prof ON prof.prestador_id = p.id
      WHERE prof.id = auth.uid()
    )
  );

CREATE POLICY "Admins e gerentes podem gerenciar avaliações"
  ON public.avaliacoes FOR ALL
  TO authenticated
  USING (public.is_admin_or_manager());

-- 7. Criar função para atualizar média de avaliações
CREATE OR REPLACE FUNCTION public.atualizar_media_avaliacoes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.prestadores
  SET 
    media_avaliacoes = (
      SELECT COALESCE(AVG(nota), 0)
      FROM public.avaliacoes
      WHERE prestador_id = COALESCE(NEW.prestador_id, OLD.prestador_id)
    ),
    total_avaliacoes = (
      SELECT COUNT(*)
      FROM public.avaliacoes
      WHERE prestador_id = COALESCE(NEW.prestador_id, OLD.prestador_id)
    )
  WHERE id = COALESCE(NEW.prestador_id, OLD.prestador_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 8. Criar trigger para atualizar média automaticamente
DROP TRIGGER IF EXISTS trigger_atualizar_media_avaliacoes ON public.avaliacoes;
CREATE TRIGGER trigger_atualizar_media_avaliacoes
  AFTER INSERT OR UPDATE OR DELETE ON public.avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.atualizar_media_avaliacoes();

-- 9. Trigger para updated_at
DROP TRIGGER IF EXISTS update_avaliacoes_updated_at ON public.avaliacoes;
CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON public.avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Comentários para documentação
COMMENT ON TABLE public.avaliacoes IS 'Sistema de avaliações de prestadores por clientes';
COMMENT ON COLUMN public.avaliacoes.nota IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN public.avaliacoes.resposta_prestador IS 'Resposta do prestador à avaliação';
COMMENT ON COLUMN public.prestadores.media_avaliacoes IS 'Média calculada automaticamente das avaliações';
COMMENT ON COLUMN public.prestadores.total_avaliacoes IS 'Total de avaliações recebidas';
COMMENT ON COLUMN public.prestadores.disponibilidade IS 'Status de disponibilidade: disponivel, indisponivel, ocupado';