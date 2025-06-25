
-- Habilitar RLS na tabela vendas
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados vejam todas as vendas
CREATE POLICY "Allow authenticated users to view all vendas" 
  ON public.vendas 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Política para permitir que usuários autenticados criem vendas
CREATE POLICY "Allow authenticated users to create vendas" 
  ON public.vendas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Política para permitir que usuários autenticados atualizem vendas
CREATE POLICY "Allow authenticated users to update vendas" 
  ON public.vendas 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Habilitar RLS na tabela vendas_servicos também
ALTER TABLE public.vendas_servicos ENABLE ROW LEVEL SECURITY;

-- Políticas para vendas_servicos
CREATE POLICY "Allow authenticated users to view all vendas_servicos" 
  ON public.vendas_servicos 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to create vendas_servicos" 
  ON public.vendas_servicos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vendas_servicos" 
  ON public.vendas_servicos 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Habilitar RLS na tabela guias se ainda não estiver habilitado
ALTER TABLE public.guias ENABLE ROW LEVEL SECURITY;

-- Políticas para guias
CREATE POLICY "Allow authenticated users to view all guias" 
  ON public.guias 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to create guias" 
  ON public.guias 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update guias" 
  ON public.guias 
  FOR UPDATE 
  TO authenticated 
  USING (true);
