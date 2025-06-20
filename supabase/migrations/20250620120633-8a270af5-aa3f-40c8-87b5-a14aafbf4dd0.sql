
-- Atualizar o usuário caetano.willian@gmail.com para administrador
UPDATE public.profiles 
SET nivel_acesso = 'admin' 
WHERE email = 'caetano.willian@gmail.com';

-- Se não existir com esse email exato, tentar variações
UPDATE public.profiles 
SET nivel_acesso = 'admin' 
WHERE email ILIKE '%willian%' AND email ILIKE '%caetano%';

-- Garantir que o status está ativo
UPDATE public.profiles 
SET status = 'ativo' 
WHERE email ILIKE '%willian%' AND email ILIKE '%caetano%';
