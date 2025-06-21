
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  email: string;
  nome: string;
  nivel_acesso: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nome, nivel_acesso }: InviteRequest = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gerar token único e data de expiração
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira em 7 dias

    // Salvar convite no banco
    const { data: invite, error: inviteError } = await supabase
      .from('user_invites')
      .insert({
        email,
        nome,
        nivel_acesso,
        token,
        expires_at: expiresAt.toISOString(),
        invited_by: req.headers.get('user-id')
      })
      .select()
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Link de ativação (você deve ajustar para seu domínio)
    const activationLink = `${req.headers.get('origin')}/auth/activate?token=${token}`;

    console.log(`Convite criado para ${email}:`);
    console.log(`Nome: ${nome}`);
    console.log(`Nível de acesso: ${nivel_acesso}`);
    console.log(`Link de ativação: ${activationLink}`);
    console.log(`Token: ${token}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Convite criado com sucesso',
        invite_id: invite.id,
        activation_link: activationLink
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Erro ao enviar convite:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
