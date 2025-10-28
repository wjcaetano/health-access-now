import { format } from 'https://esm.sh/date-fns@3.0.0';
import { ptBR } from 'https://esm.sh/date-fns@3.0.0/locale';

interface LembreteAgendamentoProps {
  nomeCliente: string;
  nomeServico: string;
  nomePrestador: string;
  dataAgendamento: string;
  horario: string;
  codigoAutenticacao: string;
  endereco?: string;
}

export function getLembreteAgendamentoTemplate({
  nomeCliente,
  nomeServico,
  nomePrestador,
  dataAgendamento,
  horario,
  codigoAutenticacao,
  endereco
}: LembreteAgendamentoProps): string {
  const dataFormatada = format(new Date(dataAgendamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lembrete de Agendamento - AGENDAJA</title>
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
            border-bottom: 3px solid #f59e0b;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #0EA5E9;
            margin-bottom: 10px;
          }
          .reminder-icon {
            font-size: 48px;
            margin: 20px 0;
          }
          h1 {
            color: #f59e0b;
            margin-top: 0;
          }
          .highlight-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: bold;
            color: #92400e;
          }
          .detail-value {
            color: #333;
          }
          .auth-code {
            background-color: #fff;
            border: 2px solid #f59e0b;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
          }
          .auth-code-label {
            font-size: 12px;
            color: #92400e;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .auth-code-value {
            font-size: 28px;
            font-weight: bold;
            color: #92400e;
            letter-spacing: 3px;
          }
          .checklist {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
          }
          .checklist-item {
            padding: 8px 0;
            display: flex;
            align-items: center;
          }
          .checklist-icon {
            margin-right: 10px;
            color: #10b981;
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
            <div class="reminder-icon">🔔</div>
            <p>Sistema de Gestão de Saúde</p>
          </div>
          
          <h1>Lembrete: Agendamento Amanhã!</h1>
          
          <p>Olá, <strong>${nomeCliente}</strong>!</p>
          
          <p>
            Este é um lembrete amigável de que você tem um agendamento <strong>amanhã</strong>:
          </p>
          
          <div class="highlight-box">
            <div class="detail-row">
              <span class="detail-label">📋 Serviço:</span>
              <span class="detail-value">${nomeServico}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">👨‍⚕️ Prestador:</span>
              <span class="detail-value">${nomePrestador}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📅 Data:</span>
              <span class="detail-value">${dataFormatada}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🕐 Horário:</span>
              <span class="detail-value">${horario}</span>
            </div>
            ${endereco ? `
            <div class="detail-row">
              <span class="detail-label">📍 Local:</span>
              <span class="detail-value">${endereco}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="auth-code">
            <div class="auth-code-label">SEU CÓDIGO DE AUTENTICAÇÃO</div>
            <div class="auth-code-value">${codigoAutenticacao}</div>
          </div>
          
          <div class="checklist">
            <p style="margin-top: 0;"><strong>✓ Checklist para amanhã:</strong></p>
            <div class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span>Chegue 10 minutos antes do horário</span>
            </div>
            <div class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span>Leve documento com foto</span>
            </div>
            <div class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span>Anote o código de autenticação</span>
            </div>
            <div class="checklist-item">
              <span class="checklist-icon">✓</span>
              <span>Traga pedidos médicos (se houver)</span>
            </div>
          </div>
          
          <p style="margin-top: 30px; text-align: center; color: #666;">
            Precisa remarcar ou cancelar?<br>
            Entre em contato conosco o quanto antes.
          </p>
          
          <div class="footer">
            <p>
              <strong>AGENDAJA</strong><br>
              Sistema de Gestão de Saúde<br>
              📞 (11) 9999-9999<br>
              📧 contato@agendaja.com.br
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
