
-- Limpar todos os dados de usuários e colaboradores, exceto o admin
DELETE FROM public.profiles WHERE email != 'wandersoncaetanopax@gmail.com';
DELETE FROM public.colaboradores WHERE email != 'wandersoncaetanopax@gmail.com';
DELETE FROM public.user_invites;
DELETE FROM public.user_audit_log;
DELETE FROM public.notifications;

-- Remover a tabela de convites já que não será mais necessária
DROP TABLE IF EXISTS public.user_invites;

-- Atualizar o usuário admin para garantir que está correto
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

-- Remover a função de convites que não será mais necessária
DROP FUNCTION IF EXISTS delete_colaborador_and_user(text);

-- Criar nova função simplificada para exclusão
CREATE OR REPLACE FUNCTION delete_user_and_colaborador(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Buscar o ID do usuário pelo email
    SELECT au.id INTO user_uuid
    FROM auth.users au
    WHERE au.email = user_email;
    
    -- Excluir da tabela colaboradores
    DELETE FROM public.colaboradores WHERE email = user_email;
    
    -- Se encontrou o usuário, excluir da tabela auth.users
    IF user_uuid IS NOT NULL THEN
        DELETE FROM auth.users WHERE id = user_uuid;
    END IF;
END;
$$;

-- Dar permissões
GRANT EXECUTE ON FUNCTION delete_user_and_colaborador(text) TO authenticated;
