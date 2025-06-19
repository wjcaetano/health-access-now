
-- Função para verificar se o usuário é admin ou manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND nivel_acesso IN ('admin', 'gerente')
      AND status = 'ativo'
  );
$$;

-- Atualizar usuários de teste
UPDATE public.profiles 
SET nivel_acesso = 'admin' 
WHERE email = 'willian@exemplo.com' OR nome ILIKE '%willian%';

UPDATE public.profiles 
SET nivel_acesso = 'colaborador' 
WHERE email = 'wanderson@exemplo.com' OR nome ILIKE '%wanderson%';
