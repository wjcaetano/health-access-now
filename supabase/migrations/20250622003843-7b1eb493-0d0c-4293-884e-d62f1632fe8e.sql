
-- Limpar todos os dados de usuários e colaboradores, exceto o admin
DELETE FROM public.profiles WHERE email != 'wandersoncaetanopax@gmail.com';
DELETE FROM public.colaboradores WHERE email != 'wandersoncaetanopax@gmail.com';

-- Limpar outras tabelas relacionadas que podem ter dados órfãos
DELETE FROM public.user_audit_log WHERE user_id NOT IN (
  SELECT id FROM public.profiles WHERE email = 'wandersoncaetanopax@gmail.com'
);
DELETE FROM public.notifications WHERE user_id NOT IN (
  SELECT id FROM public.profiles WHERE email = 'wandersoncaetanopax@gmail.com'
);

-- Limpar usuários da tabela auth.users exceto o admin
-- Primeiro, obter o ID do usuário admin
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Buscar o ID do usuário admin
    SELECT au.id INTO admin_user_id
    FROM auth.users au
    WHERE au.email = 'wandersoncaetanopax@gmail.com';
    
    -- Se encontrou o admin, excluir todos os outros usuários
    IF admin_user_id IS NOT NULL THEN
        DELETE FROM auth.users WHERE id != admin_user_id;
    END IF;
END $$;

-- Garantir que o usuário admin está correto na tabela profiles
UPDATE public.profiles 
SET 
  nivel_acesso = 'admin',
  status = 'ativo',
  nome = 'Wanderson Caetano'
WHERE email = 'wandersoncaetanopax@gmail.com';

-- Inserir colaborador correspondente se não existir
INSERT INTO public.colaboradores (nome, email, nivel_acesso, cargo)
SELECT 'Wanderson Caetano', 'wandersoncaetanopax@gmail.com', 'admin', 'Administrador'
WHERE NOT EXISTS (
  SELECT 1 FROM public.colaboradores WHERE email = 'wandersoncaetanopax@gmail.com'
);
