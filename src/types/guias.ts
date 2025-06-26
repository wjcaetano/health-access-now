
import { Tables } from "@/integrations/supabase/types";

export type Guia = Tables<"guias">;

export type GuiaComVendas = Guia & {
  clientes?: Tables<"clientes">;
  servicos?: Tables<"servicos">;
  prestadores?: Tables<"prestadores">;
  vendas_servicos?: Array<{
    venda_id: string;
    vendas: {
      id: string;
      created_at: string;
      valor_total: number;
      metodo_pagamento: string;
    };
  }>;
  data_expiracao?: string;
};

export const GUIA_STATUS = {
  emitida: 'emitida',
  realizada: 'realizada', 
  faturada: 'faturada',
  paga: 'paga',
  cancelada: 'cancelada',
  estornada: 'estornada',
  expirada: 'expirada'
} as const;

export const STATUS_TRANSITIONS = {
  prestador: {
    emitida: ['realizada', 'cancelada'],
    realizada: ['faturada', 'cancelada'],
    faturada: ['cancelada']
  },
  unidade: {
    emitida: ['cancelada'],
    realizada: ['cancelada'],
    faturada: ['paga', 'cancelada', 'estornada'],
    paga: ['estornada']
  }
} as const;

export type UserType = 'prestador' | 'unidade';
export type GuiaStatus = keyof typeof GUIA_STATUS;
