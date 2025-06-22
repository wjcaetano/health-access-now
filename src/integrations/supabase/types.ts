export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      agenda_pagamentos: {
        Row: {
          ano: number
          created_at: string | null
          data_escolhida: string
          id: string
          mes: number
          prestador_id: string | null
        }
        Insert: {
          ano: number
          created_at?: string | null
          data_escolhida: string
          id?: string
          mes: number
          prestador_id?: string | null
        }
        Update: {
          ano?: number
          created_at?: string | null
          data_escolhida?: string
          id?: string
          mes?: number
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
          telefone?: string
        }
        Relationships: []
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
          status_trabalho?: string | null
        }
        Relationships: []
      }
      contas_pagar: {
        Row: {
          created_at: string | null
          data_pagamento: string | null
          data_vencimento: string
          descricao: string | null
          guias_ids: string[] | null
          id: string
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
        ]
      }
      guias: {
        Row: {
          agendamento_id: string | null
          cliente_id: string | null
          codigo_autenticacao: string
          data_emissao: string | null
          data_faturamento: string | null
          data_pagamento: string | null
          data_realizacao: string | null
          id: string
          prestador_id: string | null
          servico_id: string | null
          status: string
          valor: number
        }
        Insert: {
          agendamento_id?: string | null
          cliente_id?: string | null
          codigo_autenticacao: string
          data_emissao?: string | null
          data_faturamento?: string | null
          data_pagamento?: string | null
          data_realizacao?: string | null
          id?: string
          prestador_id?: string | null
          servico_id?: string | null
          status: string
          valor: number
        }
        Update: {
          agendamento_id?: string | null
          cliente_id?: string | null
          codigo_autenticacao?: string
          data_emissao?: string | null
          data_faturamento?: string | null
          data_pagamento?: string | null
          data_realizacao?: string | null
          id?: string
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
        ]
      }
      mensagens: {
        Row: {
          cliente_id: string | null
          colaborador_id: string | null
          created_at: string | null
          id: string
          lida: boolean | null
          texto: string
          tipo: string
        }
        Insert: {
          cliente_id?: string | null
          colaborador_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
          texto: string
          tipo: string
        }
        Update: {
          cliente_id?: string | null
          colaborador_id?: string | null
          created_at?: string | null
          id?: string
          lida?: boolean | null
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
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orcamentos: {
        Row: {
          cliente_id: string | null
          created_at: string | null
          data_validade: string
          id: string
          observacoes: string | null
          percentual_desconto: number | null
          prestador_id: string | null
          servico_id: string | null
          status: string
          valor_custo: number
          valor_final: number
          valor_venda: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string | null
          data_validade: string
          id?: string
          observacoes?: string | null
          percentual_desconto?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          status: string
          valor_custo: number
          valor_final: number
          valor_venda: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string | null
          data_validade?: string
          id?: string
          observacoes?: string | null
          percentual_desconto?: number | null
          prestador_id?: string | null
          servico_id?: string | null
          status?: string
          valor_custo?: number
          valor_final?: number
          valor_venda?: number
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
        ]
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
          email: string
          endereco: string
          especialidades: string[] | null
          id: string
          nome: string
          telefone: string
          tipo: string
          tipo_conta: string | null
        }
        Insert: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          cnpj: string
          comissao?: number | null
          conta?: string | null
          data_cadastro?: string | null
          email: string
          endereco: string
          especialidades?: string[] | null
          id?: string
          nome: string
          telefone: string
          tipo: string
          tipo_conta?: string | null
        }
        Update: {
          agencia?: string | null
          ativo?: boolean | null
          banco?: string | null
          cnpj?: string
          comissao?: number | null
          conta?: string | null
          data_cadastro?: string | null
          email?: string
          endereco?: string
          especialidades?: string[] | null
          id?: string
          nome?: string
          telefone?: string
          tipo?: string
          tipo_conta?: string | null
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_audit_log: {
        Args: {
          target_user_id: string
          action_type: string
          action_details?: Json
        }
        Returns: string
      }
      create_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
        }
        Returns: string
      }
      delete_user_and_colaborador: {
        Args: { user_email: string }
        Returns: undefined
      }
      get_ultimo_ponto_colaborador: {
        Args: { colaborador_uuid: string }
        Returns: {
          tipo_ponto: string
          data_ponto: string
          created_at: string
        }[]
      }
      get_user_level: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_active: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ja_bateu_ponto_hoje: {
        Args: { colaborador_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
