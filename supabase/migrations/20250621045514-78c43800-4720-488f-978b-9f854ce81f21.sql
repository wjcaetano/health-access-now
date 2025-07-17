
-- Criar função para excluir usuário e colaborador de forma segura
CREATE OR REPLACE FUNCTION delete_colaborador_and_user(colaborador_email text)
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
    WHERE au.email = colaborador_email;
    
    -- Se encontrou o usuário, excluir da tabela auth.users
    -- Isso vai cascatear e excluir automaticamente de profiles devido ao ON DELETE CASCADE
    IF user_uuid IS NOT NULL THEN
        DELETE FROM auth.users WHERE id = user_uuid;
    END IF;
    
    -- Excluir da tabela colaboradores
    DELETE FROM public.colaboradores WHERE email = colaborador_email;
END;
$$;

-- Dar permissões para usuários autenticados executarem a função
GRANT EXECUTE ON FUNCTION delete_colaborador_and_user(text) TO authenticated;
