import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('📧 Send Email function called');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json();
    
    console.log('📧 Enviando email para:', to);
    console.log('📧 Assunto:', subject);

    // Validar dados obrigatórios
    if (!to || !subject || !html) {
      throw new Error('Campos obrigatórios faltando: to, subject, html');
    }

    const emailResponse = await resend.emails.send({
      from: from || "AGENDAJA <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (emailResponse.error) {
      console.error('❌ Erro ao enviar email:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log("✅ Email enviado com sucesso:", emailResponse.data);

    return new Response(
      JSON.stringify({ 
        success: true,
        data: emailResponse.data 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Erro na função send-email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
