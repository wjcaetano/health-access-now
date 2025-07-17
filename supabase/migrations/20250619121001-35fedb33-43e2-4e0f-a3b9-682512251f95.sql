
-- Adicionar campo de status na tabela profiles
ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'ativo' CHECK (status IN ('pendente', 'aguardando_aprovacao', 'ativo', 'suspenso', 'inativo'));

-- Adicionar índice para melhor performance
CREATE INDEX idx_profiles_status ON public.profiles(status);

-- Função para verificar se usuário está ativo
CREATE OR REPLACE FUNCTION public.is_user_active()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND status = 'ativo'
  );
$$;

-- Atualizar políticas RLS para considerar status ativo
DROP POLICY IF EXISTS "Active users can view their own profile" ON public.profiles;
CREATE POLICY "Active users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id AND status = 'ativo');

-- Política para permitir que usuários vejam seu próprio perfil mesmo quando não ativo (para mostrar status)
DROP POLICY IF EXISTS "Users can view own profile status" ON public.profiles;
CREATE POLICY "Users can view own profile status" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Admins e gerentes podem ver todos os perfis
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin_or_manager());
