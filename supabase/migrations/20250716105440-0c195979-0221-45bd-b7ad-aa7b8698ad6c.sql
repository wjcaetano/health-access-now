
-- 2.1.1 Criar tabela tenants para gestão de inquilinos
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('holding', 'franquia', 'prestador')),
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'suspenso', 'inativo')),
  configuracoes JSONB DEFAULT '{}',
  tenant_pai_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2.1.2 Adicionar campo tenant_id em todas as tabelas relevantes
ALTER TABLE public.profiles ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.clientes ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.prestadores ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.servicos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.colaboradores ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.agendamentos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.orcamentos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.vendas ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.vendas_servicos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.guias ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.contas_pagar ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.contas_receber ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.mensagens ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.notifications ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.ponto_eletronico ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.agenda_pagamentos ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);

-- 2.1.3 Criar função para obter tenant do usuário
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 2.1.4 Criar função para verificar se usuário tem acesso ao tenant
CREATE OR REPLACE FUNCTION public.user_has_tenant_access(target_tenant_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.tenants t ON (p.tenant_id = t.id OR p.tenant_id = t.tenant_pai_id OR t.tenant_pai_id = p.tenant_id)
    WHERE p.id = auth.uid() 
    AND (t.id = target_tenant_id OR p.tenant_id = target_tenant_id)
  );
$$;

-- 2.1.5 Implementar triggers para isolamento automático
CREATE OR REPLACE FUNCTION public.set_tenant_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := public.get_user_tenant_id();
  END IF;
  RETURN NEW;
END;
$$;

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.prestadores FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.servicos FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.colaboradores FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.agendamentos FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.vendas FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.vendas_servicos FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.guias FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.contas_pagar FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.contas_receber FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.mensagens FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.ponto_eletronico FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();
CREATE TRIGGER set_tenant_id_trigger BEFORE INSERT ON public.agenda_pagamentos FOR EACH ROW EXECUTE FUNCTION public.set_tenant_id();

-- Habilitar RLS na tabela tenants
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tenants
CREATE POLICY "Users can view their tenant and children" ON public.tenants
  FOR SELECT USING (
    id = public.get_user_tenant_id() 
    OR tenant_pai_id = public.get_user_tenant_id()
    OR id IN (
      SELECT t.tenant_pai_id FROM public.tenants t 
      WHERE t.id = public.get_user_tenant_id()
    )
  );

CREATE POLICY "Admins can manage tenants" ON public.tenants
  FOR ALL USING (is_admin_or_manager());

-- 2.1.3 Atualizar políticas RLS existentes para incluir isolamento por tenant
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Active users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile status" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view profiles in their tenant" ON public.profiles
  FOR SELECT USING (
    (auth.uid() = id) OR 
    (tenant_id = public.get_user_tenant_id() AND is_admin_or_manager()) OR
    public.user_has_tenant_access(tenant_id)
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Clientes
DROP POLICY IF EXISTS "Colaboradores podem ver todos os clientes" ON public.clientes;
DROP POLICY IF EXISTS "Colaboradores podem criar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Colaboradores podem atualizar clientes" ON public.clientes;

CREATE POLICY "Users can view clients in their tenant" ON public.clientes
  FOR SELECT USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can create clients in their tenant" ON public.clientes
  FOR INSERT WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update clients in their tenant" ON public.clientes
  FOR UPDATE USING (public.user_has_tenant_access(tenant_id));

-- Prestadores
DROP POLICY IF EXISTS "Colaboradores podem ver todos os prestadores" ON public.prestadores;
DROP POLICY IF EXISTS "Colaboradores podem criar prestadores" ON public.prestadores;
DROP POLICY IF EXISTS "Colaboradores podem atualizar prestadores" ON public.prestadores;

CREATE POLICY "Users can view providers in their tenant" ON public.prestadores
  FOR SELECT USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can create providers in their tenant" ON public.prestadores
  FOR INSERT WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update providers in their tenant" ON public.prestadores
  FOR UPDATE USING (public.user_has_tenant_access(tenant_id));

-- Serviços
DROP POLICY IF EXISTS "Colaboradores podem ver todos os servicos" ON public.servicos;
DROP POLICY IF EXISTS "Colaboradores podem criar servicos" ON public.servicos;
DROP POLICY IF EXISTS "Colaboradores podem atualizar servicos" ON public.servicos;

CREATE POLICY "Users can view services in their tenant" ON public.servicos
  FOR SELECT USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Users can create services in their tenant" ON public.servicos
  FOR INSERT WITH CHECK (tenant_id = public.get_user_tenant_id());

CREATE POLICY "Users can update services in their tenant" ON public.servicos
  FOR UPDATE USING (public.user_has_tenant_access(tenant_id));

-- Tabela para convites por tenant
CREATE TABLE public.tenant_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  nivel_acesso TEXT NOT NULL DEFAULT 'colaborador',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'expirado', 'cancelado')),
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

-- RLS para tenant_invites
ALTER TABLE public.tenant_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invites for their tenant" ON public.tenant_invites
  FOR SELECT USING (public.user_has_tenant_access(tenant_id));

CREATE POLICY "Admins can manage invites for their tenant" ON public.tenant_invites
  FOR ALL USING (
    public.user_has_tenant_access(tenant_id) AND is_admin_or_manager()
  );

-- Função untuk aceitar convite
CREATE OR REPLACE FUNCTION public.accept_tenant_invite(invite_token TEXT, user_password TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_record public.tenant_invites;
  new_user_id UUID;
BEGIN
  -- Buscar convite válido
  SELECT * INTO invite_record
  FROM public.tenant_invites
  WHERE token = invite_token
    AND status = 'pendente'
    AND expires_at > now();
  
  IF invite_record IS NULL THEN
    RETURN jsonb_build_object('error', 'Convite inválido ou expirado');
  END IF;
  
  -- Criar usuário
  INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    invite_record.email,
    crypt(user_password, gen_salt('bf')),
    now(),
    jsonb_build_object('nome', invite_record.nome, 'nivel_acesso', invite_record.nivel_acesso)
  )
  RETURNING id INTO new_user_id;
  
  -- Criar profile
  INSERT INTO public.profiles (id, email, nome, nivel_acesso, tenant_id, status)
  VALUES (
    new_user_id,
    invite_record.email,
    invite_record.nome,
    invite_record.nivel_acesso,
    invite_record.tenant_id,
    'ativo'
  );
  
  -- Marcar convite como aceito
  UPDATE public.tenant_invites
  SET status = 'aceito', accepted_at = now()
  WHERE id = invite_record.id;
  
  RETURN jsonb_build_object('success', true, 'user_id', new_user_id);
END;
$$;
