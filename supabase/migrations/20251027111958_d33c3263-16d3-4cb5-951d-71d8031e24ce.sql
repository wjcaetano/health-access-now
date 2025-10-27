-- =====================================================
-- Migration: Update RLS for Centralized Model
-- Objetivo: Remover isolamento por tenant, dados agora são centralizados
-- =====================================================

-- ============================================
-- CLIENTES: Todos autenticados veem todos
-- ============================================
DROP POLICY IF EXISTS "Users can view clients in their tenant" ON clientes;
DROP POLICY IF EXISTS "Users can create clients in their tenant" ON clientes;
DROP POLICY IF EXISTS "Users can update clients in their tenant" ON clientes;

CREATE POLICY "Authenticated users can view all clients"
  ON clientes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create clients"
  ON clientes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clientes FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- PRESTADORES: Todos autenticados veem todos
-- ============================================
DROP POLICY IF EXISTS "Users can view providers in their tenant" ON prestadores;
DROP POLICY IF EXISTS "Users can create providers in their tenant" ON prestadores;
DROP POLICY IF EXISTS "Users can update providers in their tenant" ON prestadores;

CREATE POLICY "Authenticated users can view all providers"
  ON prestadores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create providers"
  ON prestadores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update providers"
  ON prestadores FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- SERVIÇOS: Todos autenticados veem todos
-- ============================================
DROP POLICY IF EXISTS "Users can view services in their tenant" ON servicos;
DROP POLICY IF EXISTS "Users can create services in their tenant" ON servicos;
DROP POLICY IF EXISTS "Users can update services in their tenant" ON servicos;

CREATE POLICY "Authenticated users can view all services"
  ON servicos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create services"
  ON servicos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON servicos FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- ORGANIZAÇÕES: Todos podem ver, apenas admins gerenciam
-- ============================================
DROP POLICY IF EXISTS "Users can view their tenant and children" ON organizacoes;
DROP POLICY IF EXISTS "Admins can manage tenants" ON organizacoes;

CREATE POLICY "Authenticated users can view all organizations"
  ON organizacoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage organizations"
  ON organizacoes FOR ALL
  TO authenticated
  USING (is_admin_or_manager());

-- ============================================
-- VENDAS: Todos autenticados veem todas
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- AGENDAMENTOS: Todos autenticados veem todos
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- ORÇAMENTOS: Todos autenticados veem todos
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- GUIAS: Todos autenticados veem todas
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- VENDAS_SERVICOS: Todos autenticados veem todos
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- SERVICO_PRESTADORES: Todos autenticados veem todos
-- ============================================
-- Mantém as políticas existentes que já permitem acesso amplo

-- ============================================
-- PROFILES: Atualizar para remover referência a tenant
-- ============================================
DROP POLICY IF EXISTS "Users can view profiles in their tenant" ON profiles;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    is_admin_or_manager()
  );