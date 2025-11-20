-- Corrigir função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$function$;

-- Corrigir função get_user_level
CREATE OR REPLACE FUNCTION public.get_user_level()
RETURNS text
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT nivel_acesso FROM public.profiles WHERE id = auth.uid();
$function$;

-- Corrigir função is_user_active
CREATE OR REPLACE FUNCTION public.is_user_active()
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND status = 'ativo'
  );
$function$;

-- Corrigir função create_audit_log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  target_user_id uuid, 
  action_type text, 
  action_details jsonb DEFAULT NULL::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.user_audit_log (
    user_id, 
    action, 
    details, 
    performed_by
  ) VALUES (
    target_user_id,
    action_type,
    action_details,
    auth.uid()
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$function$;

-- Corrigir função create_notification
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id uuid, 
  notification_title text, 
  notification_message text, 
  notification_type text DEFAULT 'info'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type
  ) VALUES (
    target_user_id,
    notification_title,
    notification_message,
    notification_type
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;

-- Corrigir função delete_user_and_colaborador
CREATE OR REPLACE FUNCTION public.delete_user_and_colaborador(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Corrigir função get_ultimo_ponto_colaborador
CREATE OR REPLACE FUNCTION public.get_ultimo_ponto_colaborador(colaborador_uuid uuid)
RETURNS TABLE(
  tipo_ponto text, 
  data_ponto date, 
  created_at timestamp without time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT p.tipo_ponto, p.data_ponto, p.created_at
  FROM public.ponto_eletronico p
  WHERE p.colaborador_id = colaborador_uuid
  ORDER BY p.data_ponto DESC, p.created_at DESC
  LIMIT 1;
$function$;

-- Corrigir função ja_bateu_ponto_hoje
CREATE OR REPLACE FUNCTION public.ja_bateu_ponto_hoje(colaborador_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.ponto_eletronico p
    WHERE p.colaborador_id = colaborador_uuid
    AND p.data_ponto = CURRENT_DATE
    AND p.tipo_ponto = 'entrada'
  );
$function$;

-- Corrigir função atualizar_status_colaborador
CREATE OR REPLACE FUNCTION public.atualizar_status_colaborador()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF NEW.tipo_ponto = 'entrada' THEN
    UPDATE public.colaboradores 
    SET status_trabalho = 'trabalhando'
    WHERE id = NEW.colaborador_id;
  ELSIF NEW.tipo_ponto = 'saida' THEN
    UPDATE public.colaboradores 
    SET status_trabalho = 'fora_trabalho'
    WHERE id = NEW.colaborador_id;
  END IF;
  
  RETURN NEW;
END;
$function$;