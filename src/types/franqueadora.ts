
export interface Franquia {
  id: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco_completo: string;
  cep: string;
  cidade: string;
  estado: string;
  data_inauguracao?: string;
  status: 'ativa' | 'inativa' | 'suspensa' | 'em_implantacao';
  tipo_franquia: 'tradicional' | 'master' | 'microfranquia';
  valor_investimento?: number;
  taxa_royalty: number;
  taxa_marketing: number;
  meta_mensal?: number;
  territorio_exclusivo?: string;
  franqueado_responsavel_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Franqueado {
  id: string;
  nome_completo: string;
  cpf: string;
  rg?: string;
  data_nascimento?: string;
  email: string;
  telefone: string;
  endereco_completo?: string;
  experiencia_empresarial?: string;
  capital_disponivel?: number;
  referencias?: string;
  status: 'prospecto' | 'qualificado' | 'em_negociacao' | 'aprovado' | 'ativo' | 'inativo';
  score_credito?: number;
  data_primeiro_contato?: string;
  origem_lead?: 'site' | 'indicacao' | 'feira' | 'marketing_digital' | 'telemarketing' | 'outros';
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeadFranqueado {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cidade_interesse?: string | null;
  estado_interesse?: string | null;
  capital_disponivel?: number | null;
  experiencia_empresarial?: string | null;
  origem?: string | null;
  status: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'aprovado' | 'perdido';
  score: number | null;
  data_primeiro_contato?: string | null;
  responsavel_id?: string | null;
  observacoes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

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

export interface MetricasFranqueadora {
  totalFranquias: number;
  franquiasAtivas: number;
  totalLeads: number;
  leadsQualificados: number;
  royaltiesPendentes: number;
  valorRoyaltiesPendentes: number;
}
