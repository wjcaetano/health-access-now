import { format } from 'https://esm.sh/date-fns@3.0.0';
import { ptBR } from 'https://esm.sh/date-fns@3.0.0/locale';

interface AgendamentoConfirmadoProps {
  nomeCliente: string;
  nomeServico: string;
  nomePrestador: string;
  dataAgendamento: string;
  horario: string;
  codigoAutenticacao: string;
}

export function getAgendamentoConfirmadoTemplate({
  nomeCliente,
  nomeServico,
  nomePrestador,
  dataAgendamento,
  horario,
  codigoAutenticacao
}: AgendamentoConfirmadoProps): string {
  const dataFormatada = format(new Date(dataAgendamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agendamento Confirmado - AGENDAJA</title>
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
            border-bottom: 3px solid #10b981;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #0EA5E9;
            margin-bottom: 10px;
          }
          .success-icon {
            font-size: 48px;
            margin: 20px 0;
          }
          h1 {
            color: #10b981;
            margin-top: 0;
          }
          .appointment-details {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 20px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            font-weight: bold;
            color: #666;
          }
          .detail-value {
            color: #333;
          }
          .auth-code {
            background-color: #fef3c7;
            border: 2px dashed #f59e0b;
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
            font-size: 24px;
            font-weight: bold;
            color: #92400e;
            letter-spacing: 2px;
          }
          .reminder {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
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
            <div class="success-icon">✅</div>
            <p>Sistema de Gestão de Saúde</p>
          </div>
          
          <h1>Agendamento Confirmado!</h1>
          
          <p>Olá, <strong>${nomeCliente}</strong>!</p>
          
          <p>
            Seu agendamento foi confirmado com sucesso. Confira os detalhes abaixo:
          </p>
          
          <div class="appointment-details">
            <div class="detail-row">
              <span class="detail-label">Serviço:</span>
              <span class="detail-value">${nomeServico}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Prestador:</span>
              <span class="detail-value">${nomePrestador}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data:</span>
              <span class="detail-value">${dataFormatada}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Horário:</span>
              <span class="detail-value">${horario}</span>
            </div>
          </div>
          
          <div class="auth-code">
            <div class="auth-code-label">CÓDIGO DE AUTENTICAÇÃO</div>
            <div class="auth-code-value">${codigoAutenticacao}</div>
            <p style="font-size: 12px; color: #92400e; margin-top: 10px;">
              Apresente este código no dia do atendimento
            </p>
          </div>
          
          <div class="reminder">
            <p><strong>⚠️ Lembrete Importante:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Chegue com 10 minutos de antecedência</li>
              <li>Traga documento com foto</li>
              <li>Em caso de cancelamento, avise com antecedência</li>
            </ul>
          </div>
          
          <p style="margin-top: 30px;">
            Você receberá um lembrete 1 dia antes do seu agendamento.
          </p>
          
          <div class="footer">
            <p>
              <strong>AGENDAJA</strong><br>
              Sistema de Gestão de Saúde<br>
              contato@agendaja.com.br
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
