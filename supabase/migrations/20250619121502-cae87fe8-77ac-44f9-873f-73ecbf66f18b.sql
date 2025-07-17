
-- Tabela para gerenciar convites de usuários
CREATE TABLE public.user_invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  nivel_acesso TEXT NOT NULL CHECK (nivel_acesso IN ('colaborador', 'atendente', 'gerente', 'admin')),
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para histórico/auditoria de usuários
CREATE TABLE public.user_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  performed_by UUID REFERENCES auth.users NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);

-- Storage policy for profile pictures
CREATE POLICY "Users can upload their own profile picture" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile pictures are publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile picture" ON storage.objects
  FOR UPDATE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile picture" ON storage.objects
  FOR DELETE USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS
ALTER TABLE public.user_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage invites" ON public.user_invites
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

CREATE POLICY "Admins can view audit logs" ON public.user_audit_log
  FOR SELECT TO authenticated USING (public.is_admin_or_manager());

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL TO authenticated USING (public.is_admin_or_manager());

-- Função para criar log de auditoria
CREATE OR REPLACE FUNCTION public.create_audit_log(
  target_user_id UUID,
  action_type TEXT,
  action_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Função para criar notificação
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id UUID,
  notification_title TEXT,
  notification_message TEXT,
  notification_type TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Adicionar campo de foto ao perfil
ALTER TABLE public.profiles ADD COLUMN foto_url TEXT NULL;

-- Índices para performance
CREATE INDEX idx_user_invites_token ON public.user_invites(token);
CREATE INDEX idx_user_invites_email ON public.user_invites(email);
CREATE INDEX idx_user_audit_log_user_id ON public.user_audit_log(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read_at);
