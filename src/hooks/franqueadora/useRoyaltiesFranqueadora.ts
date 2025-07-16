
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Royalty {
  id: string;
  franquia_id: string;
  mes_referencia: number;
  ano_referencia: number;
  faturamento_bruto: number;
  valor_royalty: number;
  valor_marketing: number;
  valor_total: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'isento';
  observacoes?: string;
  created_at?: string;
}

export const useRoyalties = () => {
  return useQuery({
    queryKey: ["royalties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("royalties")
        .select(`
          *,
          franquia:franquias(nome_fantasia, cidade, estado)
        `)
        .order("data_vencimento", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
