import { supabase } from '@/integrations/supabase/client';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Serviço para envio de emails via Edge Function
 */
export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to,
        subject,
        html,
        from
      }
    });

    if (error) throw error;

    console.log('✅ Email enviado com sucesso:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error };
  }
}

/**
 * Envia email de confirmação de cadastro
 */
export async function sendCadastroConfirmadoEmail(
  email: string,
  nome: string,
  tipo: 'cliente' | 'prestador'
) {
  const tipoTexto = tipo === 'cliente' ? 'Cliente' : 'Prestador';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #0EA5E9; }
          .logo { font-size: 32px; font-weight: bold; color: #0EA5E9; margin-bottom: 10px; }
          h1 { color: #0EA5E9; }
          .info-box { background-color: #f0f9ff; border-left: 4px solid #0EA5E9; padding: 15px; margin: 20px 0; }
          .cta-button { display: inline-block; padding: 12px 30px; background-color: #0EA5E9; color: white !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AGENDAJA</div>
            <p>Sistema de Gestão de Saúde</p>
          </div>
          <h1>Bem-vindo(a), ${nome}! 🎉</h1>
          <p>Seu cadastro como <strong>${tipoTexto}</strong> foi realizado com sucesso!</p>
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
            <a href="https://app.agendaja.com.br" class="cta-button">Acessar Plataforma</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Bem-vindo ao AGENDAJA! 🎉`,
    html
  });
}

/**
 * Envia email de confirmação de agendamento
 */
export async function sendAgendamentoConfirmadoEmail(params: {
  email: string;
  nomeCliente: string;
  nomeServico: string;
  nomePrestador: string;
  dataAgendamento: string;
  horario: string;
  codigoAutenticacao: string;
}) {
  const { email, ...rest } = params;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #10b981; }
          h1 { color: #10b981; }
          .appointment-details { background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; }
          .auth-code { background-color: #fef3c7; border: 2px dashed #f59e0b; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .auth-code-value { font-size: 24px; font-weight: bold; color: #92400e; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 32px; font-weight: bold; color: #0EA5E9;">AGENDAJA</div>
            <div style="font-size: 48px;">✅</div>
          </div>
          <h1>Agendamento Confirmado!</h1>
          <p>Olá, <strong>${rest.nomeCliente}</strong>!</p>
          <p>Seu agendamento foi confirmado com sucesso:</p>
          <div class="appointment-details">
            <p><strong>Serviço:</strong> ${rest.nomeServico}</p>
            <p><strong>Prestador:</strong> ${rest.nomePrestador}</p>
            <p><strong>Data:</strong> ${rest.dataAgendamento}</p>
            <p><strong>Horário:</strong> ${rest.horario}</p>
          </div>
          <div class="auth-code">
            <p style="font-size: 12px; margin: 0;">CÓDIGO DE AUTENTICAÇÃO</p>
            <div class="auth-code-value">${rest.codigoAutenticacao}</div>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Agendamento Confirmado - ${rest.nomeServico}`,
    html
  });
}
