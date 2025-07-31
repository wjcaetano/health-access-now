-- Renomear tabela de convites e atualizar funções
ALTER TABLE public.tenant_invites RENAME TO unidade_invites;
ALTER TABLE public.unidade_invites RENAME COLUMN tenant_id TO unidade_id;

-- Atualizar funções para usar 'unidades' em vez de 'tenants'
CREATE OR REPLACE FUNCTION public.get_user_unidade_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT unidade_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.user_has_unidade_access(target_unidade_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.unidades u ON (p.unidade_id = u.id OR p.unidade_id = u.unidade_matriz_id OR u.unidade_matriz_id = p.unidade_id)
    WHERE p.id = auth.uid() 
    AND (u.id = target_unidade_id OR p.unidade_id = target_unidade_id)
  );
$$;

-- Atualizar trigger para usar nova função
CREATE OR REPLACE FUNCTION public.set_unidade_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.unidade_id IS NULL THEN
    NEW.unidade_id := public.get_user_unidade_id();
  END IF;
  RETURN NEW;
END;
$$;