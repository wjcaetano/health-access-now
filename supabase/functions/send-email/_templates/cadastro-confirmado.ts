interface CadastroConfirmadoProps {
  nome: string;
  tipo: 'cliente' | 'prestador';
}

export function getCadastroConfirmadoTemplate({ nome, tipo }: CadastroConfirmadoProps): string {
  const tipoTexto = tipo === 'cliente' ? 'Cliente' : 'Prestador';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao AGENDAJA</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #0EA5E9;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #0EA5E9;
            margin-bottom: 10px;
          }
          h1 {
            color: #0EA5E9;
            margin-top: 0;
          }
          .welcome-text {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
          }
          .info-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0EA5E9;
            padding: 15px;
            margin: 20px 0;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #0EA5E9;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AGENDAJA</div>
            <p>Sistema de Gestão de Saúde</p>
          </div>
          
          <h1>Bem-vindo(a), ${nome}! 🎉</h1>
          
          <p class="welcome-text">
            Seu cadastro como <strong>${tipoTexto}</strong> foi realizado com sucesso!
          </p>
          
          ${tipo === 'cliente' ? `
            <div class="info-box">
              <p><strong>Próximos passos:</strong></p>
              <ul>
                <li>Acesse o marketplace e conheça nossos serviços</li>
                <li>Agende seus procedimentos com facilidade</li>
                <li>Acompanhe suas guias e histórico</li>
              </ul>
            </div>
          ` : `
            <div class="info-box">
              <p><strong>Seu cadastro está em análise:</strong></p>
              <ul>
                <li>Nossa equipe está revisando sua solicitação</li>
                <li>Você receberá um email em até 48 horas</li>
                <li>Após aprovação, você poderá acessar o portal do prestador</li>
              </ul>
            </div>
          `}
          
          <div style="text-align: center;">
            <a href="https://app.agendaja.com.br" class="cta-button">
              Acessar Plataforma
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            Se você tiver alguma dúvida, nossa equipe está à disposição para ajudar.
          </p>
          
          <div class="footer">
            <p>
              <strong>AGENDAJA</strong><br>
              Sistema de Gestão de Saúde<br>
              contato@agendaja.com.br
            </p>
            <p style="font-size: 12px; color: #aaa;">
              Se você não se cadastrou no AGENDAJA, por favor ignore este email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
