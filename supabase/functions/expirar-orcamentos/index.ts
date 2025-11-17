import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Iniciando processo de expiração de orçamentos...');
    
    const hoje = new Date().toISOString().split('T')[0];
    console.log('Data de hoje:', hoje);

    // Buscar orçamentos pendentes com data de validade vencida
    const { data: orcamentosVencidos, error: fetchError } = await supabase
      .from('orcamentos')
      .select('id, data_validade, cliente_id')
      .eq('status', 'pendente')
      .lt('data_validade', hoje);

    if (fetchError) {
      console.error('Erro ao buscar orçamentos:', fetchError);
      throw fetchError;
    }

    console.log(`${orcamentosVencidos?.length || 0} orçamentos vencidos encontrados`);

    if (!orcamentosVencidos || orcamentosVencidos.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Nenhum orçamento vencido encontrado',
          orcamentosExpirados: 0,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // Atualizar orçamentos para status expirado
    const { data: orcamentosAtualizados, error: updateError } = await supabase
      .from('orcamentos')
      .update({ status: 'expirado' })
      .eq('status', 'pendente')
      .lt('data_validade', hoje)
      .select();

    if (updateError) {
      console.error('Erro ao atualizar orçamentos:', updateError);
      throw updateError;
    }

    const totalExpirados = orcamentosAtualizados?.length || 0;
    console.log(`${totalExpirados} orçamentos expirados com sucesso`);

    // Criar notificações para os clientes (opcional)
    if (orcamentosAtualizados && orcamentosAtualizados.length > 0) {
      const notificacoes = orcamentosAtualizados.map(orc => ({
        user_id: orc.cliente_id,
        title: 'Orçamento Expirado',
        message: `Seu orçamento expirou em ${new Date(orc.data_validade).toLocaleDateString('pt-BR')}. Entre em contato para renovar.`,
        type: 'warning'
      }));

      const { error: notifError } = await supabase
        .from('notifications')
        .insert(notificacoes);

      if (notifError) {
        console.error('Erro ao criar notificações:', notifError);
        // Não falhar a operação por causa de notificações
      } else {
        console.log(`${notificacoes.length} notificações criadas`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${totalExpirados} orçamento(s) expirado(s) com sucesso`,
        orcamentosExpirados: totalExpirados,
        detalhes: orcamentosAtualizados,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro desconhecido',
        details: error 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
