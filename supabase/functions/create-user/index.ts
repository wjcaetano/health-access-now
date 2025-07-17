
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar se o usuário está autenticado
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Não autorizado - token de autenticação necessário')
    }

    // Criar cliente Supabase com service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verificar se o usuário atual é admin/gerente
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Token inválido')
    }

    // Verificar nível de acesso
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('nivel_acesso')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !['admin', 'gerente'].includes(profile.nivel_acesso)) {
      throw new Error('Acesso negado - apenas admins e gerentes podem criar usuários')
    }

    const { nome, email, cargo, nivel_acesso } = await req.json()

    console.log("=== EDGE FUNCTION: CRIANDO USUÁRIO ===")
    console.log("Dados recebidos:", { nome, email, cargo, nivel_acesso })

    // 1. Verificar se email já existe
    console.log("1. Verificando se email já existe...")
    
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle()
    
    if (existingProfile) {
      throw new Error(`O email ${email} já está cadastrado no sistema.`)
    }
    
    const { data: existingColaborador } = await supabaseAdmin
      .from("colaboradores")
      .select("email")
      .eq("email", email)
      .maybeSingle()
    
    if (existingColaborador) {
      throw new Error(`O email ${email} já está cadastrado como colaborador.`)
    }

    // 2. Gerar senha provisória
    console.log("2. Gerando senha provisória...")
    const senhaProvisoria = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
    console.log("Senha gerada (tamanho):", senhaProvisoria.length)

    // 3. Criar usuário no Supabase Auth usando service role
    console.log("3. Criando usuário no auth...")
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password: senhaProvisoria,
      email_confirm: true,
      user_metadata: {
        nome: nome.trim(),
        nivel_acesso,
        senha_provisoria: true
      }
    })

    if (authError) {
      console.error("Erro detalhado do auth:", authError)
      throw new Error(`Erro ao criar conta de acesso: ${authError.message}`)
    }

    if (!authData?.user?.id) {
      throw new Error("Falha ao criar usuário - ID não retornado")
    }

    console.log("4. Usuário auth criado com ID:", authData.user.id)

    // 4. Criar colaborador na tabela colaboradores
    console.log("5. Criando colaborador...")
    const { data: colaboradorData, error: colaboradorError } = await supabaseAdmin
      .from("colaboradores")
      .insert({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        cargo: cargo?.trim() || '',
        nivel_acesso
      })
      .select()
      .single()

    if (colaboradorError) {
      console.error("Erro ao criar colaborador:", colaboradorError)
      
      // Rollback: excluir usuário criado
      console.log("6. Fazendo rollback do usuário auth...")
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log("Rollback concluído")
      } catch (rollbackError) {
        console.error("Erro no rollback:", rollbackError)
      }
      
      if (colaboradorError.code === '23505') {
        throw new Error(`O email ${email} já está cadastrado como colaborador.`)
      }
      
      throw new Error(`Erro ao criar colaborador: ${colaboradorError.message}`)
    }

    console.log("=== USUÁRIO CRIADO COM SUCESSO ===")
    console.log("Auth ID:", authData.user.id)
    console.log("Colaborador ID:", colaboradorData.id)

    return new Response(
      JSON.stringify({ 
        success: true,
        user: authData.user, 
        colaborador: colaboradorData,
        senha_provisoria: senhaProvisoria 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error("=== ERRO NA EDGE FUNCTION ===")
    console.error("Erro:", error)
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
