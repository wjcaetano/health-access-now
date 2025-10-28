-- Migration: Implementar Sistema de Roles Adequado
-- PARTE 1: Criar estrutura de roles

-- 1. Criar enum de roles
CREATE TYPE public.app_role AS ENUM (
  'admin',           -- Administrador AGENDAJA
  'gerente',         -- Gerente de operações
  'atendente',       -- Atendente/recepcionista
  'colaborador',     -- Colaborador geral
  'prestador',       -- Prestador de serviços (médico, lab, etc)
  'cliente'          -- Cliente/Paciente
);

-- 2. Criar tabela de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  organizacao_id UUID REFERENCES organizacoes(id), -- Opcional: role em contexto de org
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role, organizacao_id)
);

-- 3. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Criar função SECURITY DEFINER para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Criar função auxiliar para o usuário atual
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), _role);
$$;

-- 6. Criar função para obter todos os roles do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TABLE(role app_role, organizacao_id UUID)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role, organizacao_id
  FROM public.user_roles
  WHERE user_id = _user_id;
$$;

-- 7. Atualizar função is_admin_or_manager para usar novo sistema
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_user_has_role('admin') OR public.current_user_has_role('gerente');
$$;

-- 8. Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.current_user_has_role('admin'));

-- 9. Migrar dados existentes de profiles.nivel_acesso para user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, nivel_acesso::app_role 
FROM public.profiles
WHERE nivel_acesso IS NOT NULL
ON CONFLICT (user_id, role, organizacao_id) DO NOTHING;

-- 10. Adicionar índices para performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

COMMENT ON TABLE public.user_roles IS 'Tabela de roles dos usuários - CRÍTICO: Nunca armazenar roles diretamente no profile!';
COMMENT ON FUNCTION public.has_role IS 'Função SECURITY DEFINER para verificar role - previne recursão em RLS';
COMMENT ON FUNCTION public.current_user_has_role IS 'Atalho para verificar role do usuário autenticado';