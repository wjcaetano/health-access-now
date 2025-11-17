export function gerarEmailOnboardingColaborador(params: {
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
      <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://app.')}/login" class="cta-button">
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
