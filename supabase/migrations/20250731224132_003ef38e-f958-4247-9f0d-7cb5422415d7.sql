-- Corrigir função get_user_tenant_id para usar unidade_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT unidade_id FROM public.profiles WHERE id = auth.uid();
$function$;

-- Corrigir função user_has_tenant_access para usar unidade_id
CREATE OR REPLACE FUNCTION public.user_has_tenant_access(target_tenant_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.unidades u ON (p.unidade_id = u.id OR p.unidade_id = u.unidade_matriz_id OR u.unidade_matriz_id = p.unidade_id)
    WHERE p.id = auth.uid() 
    AND (u.id = target_tenant_id OR p.unidade_id = target_tenant_id)
  );
$function$;