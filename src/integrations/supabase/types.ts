export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      agenda_pagamentos: {
        Row: {
          ano: number
          created_at: string | null
          data_escolhida: string
          id: string
          mes: number
          organizacao_id: string | null
          prestador_id: string | null
        }
        Insert: {
          ano: number
          created_at?: string | null
          data_escolhida: string
          id?: string
          mes: number
          organizacao_id?: string | null
          prestador_id?: string | null
        }
        Update: {
          ano?: number
          created_at?: string | null
          data_escolhida?: string
          id?: string
          mes?: number
          organizacao_id?: string | null
          prestador_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agenda_pagamentos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agenda_pagamentos_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      agendamentos: {
        Row: {
          cliente_id: string | null
          codigo_autenticacao: string
          created_at: string | null
          data_agendamento: string
          horario: string
          id: string
          observacoes: string | null
          organizacao_id: string | null
          prestador_id: string | null
          servico_id: string | null
          status: string
        }
        Insert: {
          cliente_id?: string | null
          codigo_autenticacao: string
          created_at?: string | null
          data_agendamento: string
          horario: string
          id?: string
          observacoes?: string | null
          organizacao_id?: string | null
          prestador_id?: string | null
          servico_id?: string | null
          status: string
        }
        Update: {
          cliente_id?: string | null
          codigo_autenticacao?: string
          created_at?: string | null
          data_agendamento?: string
          horario?: string
          id?: string
          observacoes?: string | null
          organizacao_id?: string | null
          prestador_id?: string | null
          servico_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      avaliacoes: {
        Row: {
          cliente_id: string
          comentario: string | null
          created_at: string
          guia_id: string
          id: string
          nota: number
          organizacao_id: string | null
          prestador_id: string
          resposta_prestador: string | null
          updated_at: string
        }
        Insert: {
          cliente_id: string
          comentario?: string | null
          created_at?: string
          guia_id: string
          id?: string
          nota: number
          organizacao_id?: string | null
          prestador_id: string
          resposta_prestador?: string | null
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          comentario?: string | null
          created_at?: string
          guia_id?: string
          id?: string
          nota?: number
          organizacao_id?: string | null
          prestador_id?: string
          resposta_prestador?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_guia_id_fkey"
            columns: ["guia_id"]
            isOneToOne: true
            referencedRelation: "guias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cpf: string
          data_cadastro: string | null
          email: string
          endereco: string | null
          id: string
          id_associado: string
          nome: string
          organizacao_id: string | null
          telefone: string
        }
        Insert: {
          cpf: string
          data_cadastro?: string | null
          email: string
          endereco?: string | null
          id?: string
          id_associado: string
          nome: string
          organizacao_id?: string | null
          telefone: string
        }
        Update: {
          cpf?: string
          data_cadastro?: string | null
          email?: string
          endereco?: string | null
          id?: string
          id_associado?: string
          nome?: string
          organizacao_id?: string | null
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          ativo: boolean | null
          cargo: string | null
          data_cadastro: string | null
          email: string
          id: string
          nivel_acesso: string
          nome: string
          organizacao_id: string | null
          status_trabalho: string | null
        }
        Insert: {
          ativo?: boolean | null
          cargo?: string | null
          data_cadastro?: string | null
          email: string
          id?: string
          nivel_acesso: string
          nome: string
          organizacao_id?: string | null
          status_trabalho?: string | null
        }
        Update: {
          ativo?: boolean | null
          cargo?: string | null
          data_cadastro?: string | null
          email?: string
          id?: string
          nivel_acesso?: string
          nome?: string
          organizacao_id?: string | null
          status_trabalho?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_pagar: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          descricao: string | null
          guias_ids: string[] | null
          id: string
          organizacao_id: string | null
          prestador_id: string | null
          status: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          descricao?: string | null
          guias_ids?: string[] | null
          id?: string
          organizacao_id?: string | null
          prestador_id?: string | null
          status: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string | null
          guias_ids?: string[] | null
          id?: string
          organizacao_id?: string | null
          prestador_id?: string | null
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_pagar_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_pagar_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_receber: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          descricao: string | null
          guias_ids: string[] | null
          id: string
          organizacao_id: string | null
          status: string
          tipo_pagamento: string | null
          valor: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento: string
          descricao?: string | null
          guias_ids?: string[] | null
          id?: string
          organizacao_id?: string | null
          status: string
          tipo_pagamento?: string | null
          valor: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string | null
          guias_ids?: string[] | null
          id?: string
          organizacao_id?: string | null
          status?: string
          tipo_pagamento?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      guias: {
        Row: {
          agendamento_id: string | null
          cliente_id: string | null
          codigo_autenticacao: string
          data_cancelamento: string | null
          data_emissao: string | null
          data_estorno: string | null
          data_faturamento: string | null
          data_pagamento: string | null
          data_realizacao: string | null
          id: string
          organizacao_id: string | null
          prestador_id: string | null
          servico_id: string | null
          status: string
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          cliente_id?: string | null
          codigo_autenticacao: string
          data_cancelamento?: string | null
          data_emissao?: string | null
          data_estorno?: string | null
          data_faturamento?: string | null
          data_pagamento?: string | null
          data_realizacao?: string | null
          id?: string
          organizacao_id?: string | null
          prestador_id?: string | null
          servico_id?: string | null
          status: string
          valor: number
        }
        Update: {
          agendamento_id?: string | null
          cliente_id?: string | null
          codigo_autenticacao?: string
          data_cancelamento?: string | null
          data_emissao?: string | null
          data_estorno?: string | null
          data_faturamento?: string | null
          data_pagamento?: string | null
          data_realizacao?: string | null
          id?: string
          organizacao_id?: string | null
          prestador_id?: string | null
          servico_id?: string | null
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "guias_agendamento_id_fkey"
            columns: ["agendamento_id"]
            isOneToOne: false
            referencedRelation: "agendamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guias_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guias_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guias_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guias_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      mensagens: {
        Row: {
          cliente_id: string | null
          colaborador_id: string | null
          created_at: string | null
          id: string
          lida: boolean | null
          organizacao_id: string | null
          texto: string
          tipo: string
        }
        Insert: {
          cliente_id?: string | null
          colaborador_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
          organizacao_id?: string | null
          texto: string
          tipo: string
        }
        Update: {
          cliente_id?: string | null
          colaborador_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
          organizacao_id?: string | null
          texto?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mensagens_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          organizacao_id: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          organizacao_id?: string | null
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          organizacao_id?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_validade: string
          id: string
          observacoes: string | null
          organizacao_id: string | null
          percentual_desconto: number | null
          prestador_id: string | null
          servico_id: string | null
          status: string
          valor_custo: number
          valor_final: number
          valor_venda: number
          venda_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_validade: string
          id?: string
          observacoes?: string | null
          organizacao_id?: string | null
          percentual_desconto?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          status: string
          valor_custo: number
          valor_final: number
          valor_venda: number
          venda_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_validade?: string
          id?: string
          observacoes?: string | null
          organizacao_id?: string | null
          percentual_desconto?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          status?: string
          valor_custo?: number
          valor_final?: number
          valor_venda?: number
          venda_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
      organizacoes: {
        Row: {
          codigo: string
          configuracoes: Json | null
          created_at: string
          horario_funcionamento: Json | null
          id: string
          nome: string
          status: string
          tipo_organizacao: string
          updated_at: string
        }
        Insert: {
          codigo: string
          configuracoes?: Json | null
          created_at?: string
          horario_funcionamento?: Json | null
          id?: string
          nome: string
          status?: string
          tipo_organizacao?: string
          updated_at?: string
        }
        Update: {
          codigo?: string
          configuracoes?: Json | null
          created_at?: string
          horario_funcionamento?: Json | null
          id?: string
          nome?: string
          status?: string
          tipo_organizacao?: string
          updated_at?: string
        }
        Relationships: []
      }
      ponto_eletronico: {
        Row: {
          colaborador_id: string | null
          created_at: string | null
          data_ponto: string
          hora_entrada: string | null
          hora_saida: string | null
          id: string
          observacao: string | null
          organizacao_id: string | null
          tipo_ponto: string
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string | null
          data_ponto: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          observacao?: string | null
          organizacao_id?: string | null
          tipo_ponto: string
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string | null
          data_ponto?: string
          hora_entrada?: string | null
          hora_saida?: string | null
          id?: string
          observacao?: string | null
          organizacao_id?: string | null
          tipo_ponto?: string
        }
        Relationships: [
          {
            foreignKeyName: "ponto_eletronico_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ponto_eletronico_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      prestadores: {
        Row: {
          agencia: string | null
          ativo: boolean | null
          banco: string | null
          cnpj: string
          comissao: number | null
          conta: string | null
          data_cadastro: string | null
          disponibilidade: string | null
          email: string
          endereco: string
          especialidades: string[] | null
          id: string
          localizacao: string | null
          media_avaliacoes: number | null
          nome: string
          organizacao_id: string | null
          telefone: string
          tipo: string
          tipo_conta: string | null
          total_avaliacoes: number | null
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          cnpj: string
          comissao?: number | null
          conta?: string | null
          data_cadastro?: string | null
          disponibilidade?: string | null
          email: string
          endereco: string
          especialidades?: string[] | null
          id?: string
          localizacao?: string | null
          media_avaliacoes?: number | null
          nome: string
          organizacao_id?: string | null
          telefone: string
          tipo: string
          tipo_conta?: string | null
          total_avaliacoes?: number | null
        }
        Update: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          cnpj?: string
          comissao?: number | null
          conta?: string | null
          data_cadastro?: string | null
          disponibilidade?: string | null
          email?: string
          endereco?: string
          especialidades?: string[] | null
          id?: string
          localizacao?: string | null
          media_avaliacoes?: number | null
          nome?: string
          organizacao_id?: string | null
          telefone?: string
          tipo?: string
          tipo_conta?: string | null
          total_avaliacoes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prestadores_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          colaborador_id: string | null
          created_at: string | null
          email: string
          foto_url: string | null
          id: string
          nivel_acesso: string
          nome: string | null
          organizacao_id: string | null
          prestador_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          colaborador_id?: string | null
          created_at?: string | null
          email: string
          foto_url?: string | null
          id: string
          nivel_acesso?: string
          nome?: string | null
          organizacao_id?: string | null
          prestador_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          colaborador_id?: string | null
          created_at?: string | null
          email?: string
          foto_url?: string | null
          id?: string
          nivel_acesso?: string
          nome?: string | null
          organizacao_id?: string | null
          prestador_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      servico_prestadores: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          prestador_id: string | null
          servico_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          prestador_id?: string | null
          servico_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          prestador_id?: string | null
          servico_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "servico_prestadores_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servico_prestadores_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean | null
          categoria: string
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          organizacao_id: string | null
          prestador_id: string | null
          tempo_estimado: string | null
          valor_custo: number
          valor_venda: number
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          organizacao_id?: string | null
          prestador_id?: string | null
          tempo_estimado?: string | null
          valor_custo: number
          valor_venda: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          organizacao_id?: string | null
          prestador_id?: string | null
          tempo_estimado?: string | null
          valor_custo?: number
          valor_venda?: number
        }
        Relationships: [
          {
            foreignKeyName: "servicos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicos_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          performed_by: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          performed_by: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          performed_by?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organizacao_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organizacao_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organizacao_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organizacao_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          metodo_pagamento: string
          observacoes: string | null
          organizacao_id: string | null
          status: string
          valor_total: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          metodo_pagamento: string
          observacoes?: string | null
          organizacao_id?: string | null
          status?: string
          valor_total: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          metodo_pagamento?: string
          observacoes?: string | null
          organizacao_id?: string | null
          status?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      vendas_servicos: {
        Row: {
          created_at: string
          data_agendamento: string | null
          horario: string | null
          id: string
          organizacao_id: string | null
          prestador_id: string
          servico_id: string
          status: string
          valor: number
          venda_id: string
        }
        Insert: {
          created_at?: string
          data_agendamento?: string | null
          horario?: string | null
          id?: string
          organizacao_id?: string | null
          prestador_id: string
          servico_id: string
          status?: string
          valor: number
          venda_id: string
        }
        Update: {
          created_at?: string
          data_agendamento?: string | null
          horario?: string | null
          id?: string
          organizacao_id?: string | null
          prestador_id?: string
          servico_id?: string
          status?: string
          valor?: number
          venda_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendas_servicos_prestador_id_fkey"
            columns: ["prestador_id"]
            isOneToOne: false
            referencedRelation: "prestadores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_servicos_tenant_id_fkey"
            columns: ["organizacao_id"]
            isOneToOne: false
            referencedRelation: "organizacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_servicos_venda_id_fkey"
            columns: ["venda_id"]
            isOneToOne: false
            referencedRelation: "vendas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_tenant_invite: {
        Args: { invite_token: string; user_password: string }
        Returns: Json
      }
      create_audit_log: {
        Args: {
          action_details?: Json
          action_type: string
          target_user_id: string
        }
        Returns: string
      }
      create_notification: {
        Args: {
          notification_message: string
          notification_title: string
          notification_type?: string
          target_user_id: string
        }
        Returns: string
      }
      current_user_has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      delete_user_and_colaborador: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_ultimo_ponto_colaborador: {
        Args: { colaborador_uuid: string }
        Returns: {
          created_at: string
          data_ponto: string
          tipo_ponto: string
        }[]
      }
      get_user_level: { Args: never; Returns: string }
      get_user_organizacao_id: { Args: never; Returns: string }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          organizacao_id: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      get_user_unidade_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_manager: { Args: never; Returns: boolean }
      is_user_active: { Args: never; Returns: boolean }
      ja_bateu_ponto_hoje: {
        Args: { colaborador_uuid: string }
        Returns: boolean
      }
      user_has_unidade_access: {
        Args: { target_unidade_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "gerente"
        | "atendente"
        | "colaborador"
        | "prestador"
        | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "gerente",
        "atendente",
        "colaborador",
        "prestador",
        "cliente",
      ],
    },
  },
} as const
