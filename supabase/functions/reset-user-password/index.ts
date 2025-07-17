
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email é obrigatório' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`=== INICIANDO RESET DE SENHA PARA: ${email} ===`)

    // Gerar senha provisória
    const senhaProvisoria = Math.random().toString(36).slice(-12) + 'A1@'
    
    console.log(`Senha provisória gerada para ${email}`)

    // Buscar o usuário pelo email
    const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers()
    
    if (userError) {
      console.error('Erro ao buscar usuários:', userError)
      throw userError
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Usuário não encontrado' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Usuário encontrado: ${user.id}`)

    // Atualizar a senha do usuário e marcar como senha provisória
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      user.id,
      { 
        password: senhaProvisoria,
        user_metadata: {
          ...user.user_metadata,
          senha_provisoria: true,
          senha_resetada_em: new Date().toISOString()
        }
      }
    )

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError)
      throw updateError
    }

    console.log(`Senha atualizada com sucesso para ${email}`)

    // Criar log de auditoria
    const { error: auditError } = await supabaseClient.rpc('create_audit_log', {
      target_user_id: user.id,
      action_type: 'password_reset',
      action_details: {
        reset_by_admin: true,
        reset_timestamp: new Date().toISOString()
      }
    })

    if (auditError) {
      console.warn('Erro ao criar log de auditoria:', auditError)
    }

    console.log(`=== RESET DE SENHA CONCLUÍDO PARA: ${email} ===`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Senha resetada com sucesso',
        senha_provisoria: senhaProvisoria
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('=== ERRO NO RESET DE SENHA ===')
    console.error('Tipo do erro:', typeof error)
    console.error('Erro:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro interno do servidor',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
