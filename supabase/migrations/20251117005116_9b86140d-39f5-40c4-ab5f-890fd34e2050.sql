-- Ativar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Configurar cron job para expirar orçamentos diariamente às 00:00
SELECT cron.schedule(
  'expirar-orcamentos-diario',
  '0 0 * * *', -- Todo dia à meia-noite
  $$
  SELECT
    net.http_post(
        url:='https://rlnywipigilgldpwwnfn.supabase.co/functions/v1/expirar-orcamentos',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbnl3aXBpZ2lsZ2xkcHd3bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDY3NjksImV4cCI6MjA2NTU4Mjc2OX0.tX2xDusZyCQy3MXAgiXQSLPzw09PCdVVKkkMeRD7pxM"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);