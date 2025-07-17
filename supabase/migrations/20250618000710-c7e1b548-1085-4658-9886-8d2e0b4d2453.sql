
-- Habilitar RLS em todas as tabelas (algumas já têm, mas vamos garantir)
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ponto_eletronico ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_pagamentos ENABLE ROW LEVEL SECURITY;

-- Criar tabela de perfis de usuários para ligar com auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT,
  nivel_acesso TEXT NOT NULL DEFAULT 'colaborador' CHECK (nivel_acesso IN ('colaborador', 'atendente', 'gerente', 'admin')),
  colaborador_id UUID REFERENCES public.colaboradores(id),
  prestador_id UUID REFERENCES public.prestadores(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (id)
);

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, nivel_acesso)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome', COALESCE(new.raw_user_meta_data->>'nivel_acesso', 'colaborador'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para verificar se usuário tem permissão (evita recursão RLS)
CREATE OR REPLACE FUNCTION public.get_user_level()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT nivel_acesso FROM public.profiles WHERE id = auth.uid();
$$;

-- Função para verificar se usuário é admin/gerente
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND nivel_acesso IN ('admin', 'gerente')
  );
$$;

-- Políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para colaboradores
DROP POLICY IF EXISTS "Authenticated users can view colaboradores" ON public.colaboradores;
CREATE POLICY "Authenticated users can view colaboradores" ON public.colaboradores
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage colaboradores" ON public.colaboradores;
CREATE POLICY "Admins can manage colaboradores" ON public.colaboradores
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

-- Políticas para ponto eletrônico
DROP POLICY IF EXISTS "Users can view own ponto" ON public.ponto_eletronico;
CREATE POLICY "Users can view own ponto" ON public.ponto_eletronico
  FOR SELECT TO authenticated USING (
    colaborador_id IN (
      SELECT colaborador_id FROM public.profiles WHERE id = auth.uid()
    ) OR public.is_admin_or_manager()
  );

DROP POLICY IF EXISTS "Users can insert own ponto" ON public.ponto_eletronico;
CREATE POLICY "Users can insert own ponto" ON public.ponto_eletronico
  FOR INSERT TO authenticated WITH CHECK (
    colaborador_id IN (
      SELECT colaborador_id FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Políticas básicas para outras tabelas (admin/gerente acesso total)
DROP POLICY IF EXISTS "Admins can manage clientes" ON public.clientes;
CREATE POLICY "Admins can manage clientes" ON public.clientes
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage prestadores" ON public.prestadores;
CREATE POLICY "Admins can manage prestadores" ON public.prestadores
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage servicos" ON public.servicos;
CREATE POLICY "Admins can manage servicos" ON public.servicos
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage agendamentos" ON public.agendamentos;
CREATE POLICY "Admins can manage agendamentos" ON public.agendamentos
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage orcamentos" ON public.orcamentos;
CREATE POLICY "Admins can manage orcamentos" ON public.orcamentos
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage guias" ON public.guias;
CREATE POLICY "Admins can manage guias" ON public.guias
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage contas_pagar" ON public.contas_pagar;
CREATE POLICY "Admins can manage contas_pagar" ON public.contas_pagar
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage contas_receber" ON public.contas_receber;
CREATE POLICY "Admins can manage contas_receber" ON public.contas_receber
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage mensagens" ON public.mensagens;
CREATE POLICY "Admins can manage mensagens" ON public.mensagens
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

DROP POLICY IF EXISTS "Admins can manage agenda_pagamentos" ON public.agenda_pagamentos;
CREATE POLICY "Admins can manage agenda_pagamentos" ON public.agenda_pagamentos
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_colaborador_id ON public.profiles(colaborador_id);
CREATE INDEX IF NOT EXISTS idx_profiles_prestador_id ON public.profiles(prestador_id);
CREATE INDEX IF NOT EXISTS idx_profiles_nivel_acesso ON public.profiles(nivel_acesso);
