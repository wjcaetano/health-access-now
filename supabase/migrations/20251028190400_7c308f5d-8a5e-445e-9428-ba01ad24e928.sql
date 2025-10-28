-- Habilitar Realtime para a tabela notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Adicionar à publicação do realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;