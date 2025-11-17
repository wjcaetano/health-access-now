
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Template de email de onboarding
function gerarEmailOnboardingColaborador(params: {
  nome: string;
  email: string;
  senhaProvisoria: string;
  cargo?: string;
  nivel_acesso: string;
}) {
  const { nome, email, senhaProvisoria, cargo, nivel_acesso } = params;
  
  const nivelAcessoTexto = {
    'admin': 'Administrador',
    'gerente': 'Gerente',
    'atendente': 'Atendente',
    'colaborador': 'Colaborador'
  }[nivel_acesso] || nivel_acesso;

  const loginUrl = Deno.env.get('SUPABASE_URL')?.replace('rlnywipigilgldpwwnfn.supabase.co', 'app.rlnywipigilgldpwwnfn.supabase.co') || 'https://app.agendaja.com.br/login';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao AGENDAJA</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 20px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #4F46E5;
      margin: 0;
    }
    h1 {
      color: #1a1a1a;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .welcome-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
    .credentials-box {
      background-color: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
    }
    .credential-item {
      margin: 15px 0;
    }
    .credential-label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .credential-value {
      font-size: 18px;
      color: #1a1a1a;
      font-family: 'Courier New', monospace;
      background-color: #ffffff;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #d1d5db;
      word-break: break-all;
    }
    .password-highlight {
      background-color: #fef3c7;
      border-color: #fbbf24;
      font-weight: bold;
    }
    .cta-button {
      display: inline-block;
      background-color: #4F46E5;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 25px 0;
      text-align: center;
      transition: background-color 0.2s;
    }
    .cta-button:hover {
      background-color: #4338CA;
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .steps {
      margin: 25px 0;
    }
    .step {
      display: flex;
      margin: 15px 0;
      align-items: flex-start;
    }
    .step-number {
      background-color: #4F46E5;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
      flex-shrink: 0;
      font-size: 14px;
    }
    .step-content {
      flex: 1;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 14px;
      color: #6b7280;
      text-align: center;
    }
    .support {
      margin-top: 30px;
      padding: 20px;
      background-color: #f9fafb;
      border-radius: 8px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="logo">🗓️ AGENDAJA</p>
      <p style="color: #6b7280; margin: 5px 0 0 0;">Gestão Inteligente de Serviços</p>
    </div>

    <h1>Bem-vindo(a) ao time, ${nome}! 🎉</h1>
    
    <p class="welcome-text">
      Sua conta foi criada com sucesso! Você foi cadastrado(a) como <strong>${nivelAcessoTexto}</strong>${cargo ? ` no cargo de <strong>${cargo}</strong>` : ''}.
    </p>

    <div class="warning-box">
      <strong>⚠️ Senha Provisória</strong><br>
      Por segurança, você precisará alterar esta senha no primeiro acesso.
    </div>

    <div class="credentials-box">
      <div class="credential-item">
        <div class="credential-label">Email de Acesso</div>
        <div class="credential-value">${email}</div>
      </div>
      
      <div class="credential-item">
        <div class="credential-label">Senha Provisória</div>
        <div class="credential-value password-highlight">${senhaProvisoria}</div>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${loginUrl}" class="cta-button">
        Acessar o Sistema
      </a>
    </div>

    <div class="info-box">
      <strong>📋 Primeiros Passos</strong>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <strong>Faça seu primeiro login</strong><br>
            Use o email e senha provisória acima para acessar o sistema.
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <strong>Altere sua senha</strong><br>
            No primeiro acesso, você será solicitado a criar uma senha pessoal e segura.
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <strong>Complete seu perfil</strong><br>
            Adicione uma foto e outras informações pessoais na área "Meu Perfil".
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-content">
            <strong>Explore o sistema</strong><br>
            Conheça as funcionalidades disponíveis para seu nível de acesso.
          </div>
        </div>
      </div>
    </div>

    <div class="support">
      <strong>Precisa de ajuda?</strong><br>
      Entre em contato com o administrador do sistema ou acesse nossa documentação de ajuda.
    </div>

    <div class="footer">
      <p>
        <strong>AGENDAJA</strong> - Sistema de Gestão de Serviços<br>
        Este é um email automático, por favor não responda.
      </p>
      <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
        Se você não solicitou este cadastro, por favor ignore este email ou entre em contato com o administrador.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
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

    // 6. Enviar email com senha provisória
    console.log("6. Enviando email com senha provisória...")
    try {
      const emailHtml = gerarEmailOnboardingColaborador({
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senhaProvisoria,
        cargo: cargo?.trim(),
        nivel_acesso
      });

      const { error: emailError } = await supabaseAdmin.functions.invoke('send-email', {
        body: {
          to: email.toLowerCase().trim(),
          subject: 'Bem-vindo ao AGENDAJA - Sua conta foi criada!',
          html: emailHtml
        }
      });

      if (emailError) {
        console.error('⚠️ Erro ao enviar email:', emailError);
        // Não falhar a operação, apenas logar o erro
      } else {
        console.log('✅ Email enviado com sucesso!');
      }
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email:', emailError);
      // Não falhar a operação, apenas logar o erro
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        user: authData.user, 
        colaborador: colaboradorData,
        senha_provisoria: senhaProvisoria,
        message: 'Colaborador criado com sucesso! Senha provisória enviada por email.'
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
