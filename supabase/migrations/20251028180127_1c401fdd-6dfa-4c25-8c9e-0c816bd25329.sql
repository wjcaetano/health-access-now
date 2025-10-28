-- ===============================================
-- Etapa 1.1: Adicionar cliente_id no profiles
-- ===============================================

-- 1. Adicionar coluna cliente_id na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL;

-- 2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_profiles_cliente_id ON public.profiles(cliente_id);

-- 3. Atualizar função handle_new_user para criar clientes automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cliente_id UUID;
  v_nivel_acesso TEXT;
  v_organizacao_id UUID;
BEGIN
  v_nivel_acesso := COALESCE(NEW.raw_user_meta_data->>'nivel_acesso', 'colaborador');
  
  -- Pegar primeira organização como padrão (Hub AGENDAJA)
  SELECT id INTO v_organizacao_id FROM public.organizacoes ORDER BY created_at LIMIT 1;
  
  -- Se é cliente, criar registro em clientes automaticamente
  IF v_nivel_acesso = 'cliente' THEN
    INSERT INTO public.clientes (
      nome,
      cpf,
      email,
      telefone,
      endereco,
      id_associado,
      organizacao_id
    ) VALUES (
      COALESCE(NEW.raw_user_meta_data->>'nome', 'Cliente'),
      COALESCE(NEW.raw_user_meta_data->>'cpf', '00000000000'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
      COALESCE(NEW.raw_user_meta_data->>'endereco', ''),
      COALESCE(NEW.raw_user_meta_data->>'id_associado', 'TEMP-' || substring(NEW.id::text from 1 for 8)),
      v_organizacao_id
    ) RETURNING id INTO v_cliente_id;
  END IF;

  -- Inserir perfil
  INSERT INTO public.profiles (
    id,
    email,
    nome,
    nivel_acesso,
    cliente_id,
    organizacao_id,
    status
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário'),
    v_nivel_acesso,
    v_cliente_id,
    v_organizacao_id,
    COALESCE(NEW.raw_user_meta_data->>'status', 'ativo')
  );

  -- Atribuir role na tabela user_roles
  INSERT INTO public.user_roles (user_id, role, organizacao_id)
  VALUES (NEW.id, v_nivel_acesso::app_role, v_organizacao_id);

  RETURN NEW;
END;
$$;

-- 4. Migrar clientes existentes que já têm usuários
UPDATE public.profiles p
SET cliente_id = c.id
FROM public.clientes c
WHERE p.email = c.email
  AND p.nivel_acesso = 'cliente'
  AND p.cliente_id IS NULL;

-- 5. Atualizar RLS policies para agendamentos (usar cliente_id do profile)
DROP POLICY IF EXISTS "Clientes podem ver seus agendamentos" ON public.agendamentos;
CREATE POLICY "Clientes podem ver seus agendamentos"
  ON public.agendamentos FOR SELECT
  TO authenticated
  USING (
    public.current_user_has_role('cliente') AND
    cliente_id IN (
      SELECT cliente_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- 6. Atualizar RLS policies para guias (usar cliente_id do profile)
DROP POLICY IF EXISTS "Clientes podem ver suas guias" ON public.guias;
CREATE POLICY "Clientes podem ver suas guias"
  ON public.guias FOR SELECT
  TO authenticated
  USING (
    public.current_user_has_role('cliente') AND
    cliente_id IN (
      SELECT cliente_id FROM public.profiles WHERE id = auth.uid()
    )
  );

COMMENT ON COLUMN public.profiles.cliente_id IS 'Referência ao registro do cliente quando o usuário tem role cliente';