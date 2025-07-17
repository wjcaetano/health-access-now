
-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Colaboradores podem ver todos os dados" ON public.clientes;
DROP POLICY IF EXISTS "Colaboradores podem ver todos os prestadores" ON public.prestadores;
DROP POLICY IF EXISTS "Colaboradores podem ver todos os serviços" ON public.servicos;
DROP POLICY IF EXISTS "Colaboradores podem ver todos os agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Colaboradores podem ver todos os orçamentos" ON public.orcamentos;
DROP POLICY IF EXISTS "Colaboradores podem ver todas as guias" ON public.guias;
DROP POLICY IF EXISTS "Colaboradores podem ver contas a pagar" ON public.contas_pagar;
DROP POLICY IF EXISTS "Colaboradores podem ver contas a receber" ON public.contas_receber;
DROP POLICY IF EXISTS "Colaboradores podem ver mensagens" ON public.mensagens;
DROP POLICY IF EXISTS "Prestadores podem ver sua agenda" ON public.agenda_pagamentos;
DROP POLICY IF EXISTS "Authenticated users can view their own ponto" ON public.ponto_eletronico;
DROP POLICY IF EXISTS "Authenticated users can view colaboradores" ON public.colaboradores;
DROP POLICY IF EXISTS "Admins can manage colaboradores" ON public.colaboradores;

-- Implementar RLS para tabela clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Política para colaboradores autenticados verem todos os clientes
CREATE POLICY "Colaboradores podem ver todos os clientes" 
  ON public.clientes 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política para colaboradores autenticados criarem clientes
CREATE POLICY "Colaboradores podem criar clientes" 
  ON public.clientes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Política para colaboradores autenticados atualizarem clientes
CREATE POLICY "Colaboradores podem atualizar clientes" 
  ON public.clientes 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela prestadores
ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;

-- Políticas para prestadores
CREATE POLICY "Colaboradores podem ver todos os prestadores" 
  ON public.prestadores 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar prestadores" 
  ON public.prestadores 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar prestadores" 
  ON public.prestadores 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela servicos
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- Políticas para serviços
CREATE POLICY "Colaboradores podem ver todos os servicos" 
  ON public.servicos 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar servicos" 
  ON public.servicos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar servicos" 
  ON public.servicos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela orcamentos
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para orçamentos
CREATE POLICY "Colaboradores podem ver todos os orcamentos" 
  ON public.orcamentos 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar orcamentos" 
  ON public.orcamentos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar orcamentos" 
  ON public.orcamentos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela agendamentos
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para agendamentos
CREATE POLICY "Colaboradores podem ver todos os agendamentos" 
  ON public.agendamentos 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar agendamentos" 
  ON public.agendamentos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar agendamentos" 
  ON public.agendamentos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela mensagens
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas para mensagens
CREATE POLICY "Colaboradores podem ver todas as mensagens" 
  ON public.mensagens 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar mensagens" 
  ON public.mensagens 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar mensagens" 
  ON public.mensagens 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela colaboradores
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;

-- Políticas para colaboradores - apenas admins e gerentes podem gerenciar
CREATE POLICY "Admins e gerentes podem ver todos os colaboradores" 
  ON public.colaboradores 
  FOR SELECT 
  TO authenticated 
  USING (public.is_admin_or_manager());

CREATE POLICY "Admins e gerentes podem criar colaboradores" 
  ON public.colaboradores 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "Admins e gerentes podem atualizar colaboradores" 
  ON public.colaboradores 
  FOR UPDATE 
  TO authenticated 
  USING (public.is_admin_or_manager());

-- Colaboradores podem ver seu próprio perfil
CREATE POLICY "Colaboradores podem ver próprio perfil" 
  ON public.colaboradores 
  FOR SELECT 
  TO authenticated 
  USING (id IN (SELECT colaborador_id FROM public.profiles WHERE id = auth.uid()));

-- Implementar RLS para tabelas financeiras
ALTER TABLE public.contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_pagamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para contas a pagar
CREATE POLICY "Colaboradores podem ver contas a pagar" 
  ON public.contas_pagar 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Políticas para contas a receber
CREATE POLICY "Colaboradores podem ver contas a receber" 
  ON public.contas_receber 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Políticas para agenda de pagamentos
CREATE POLICY "Colaboradores podem ver agenda de pagamentos" 
  ON public.agenda_pagamentos 
  FOR ALL 
  TO authenticated 
  USING (true);

-- Implementar RLS para tabela servico_prestadores
ALTER TABLE public.servico_prestadores ENABLE ROW LEVEL SECURITY;

-- Atualizar política existente para ser mais específica
DROP POLICY IF EXISTS "Colaboradores podem ver todos os relacionamentos" ON public.servico_prestadores;

CREATE POLICY "Colaboradores podem ver relacionamentos servico-prestador" 
  ON public.servico_prestadores 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem criar relacionamentos servico-prestador" 
  ON public.servico_prestadores 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Colaboradores podem atualizar relacionamentos servico-prestador" 
  ON public.servico_prestadores 
  FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Colaboradores podem deletar relacionamentos servico-prestador" 
  ON public.servico_prestadores 
  FOR DELETE 
  TO authenticated 
  USING (true);
