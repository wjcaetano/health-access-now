
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: Date;
  idAssociado: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  dataAgendamento: Date;
  horario: string;
  clinica: string;
  profissional: string;
  servico: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  codigoAutenticacao: string;
  createdAt: Date;
}

export interface Orcamento {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  servico: string;
  clinica: string;
  valorCusto: number;
  valorVenda: number;
  percentualDesconto: number;
  valorFinal: number;
  dataValidade: Date;
  status: 'pendente' | 'aprovado' | 'recusado' | 'expirado';
  createdAt: Date;
}

export interface Prestador {
  id: string;
  nome: string;
  tipo: 'clinica' | 'laboratorio' | 'profissional';
  especialidades?: string[];
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  contaBancaria: {
    banco: string;
    agencia: string;
    conta: string;
    tipoConta: 'corrente' | 'poupanca';
  };
  comissao: number; // percentual de comissão para a AGENDAJA
  dataCadastro: Date;
  ativo: boolean;
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  prestadorId: string;
  prestador?: Prestador;
  valorCusto: number;
  valorVenda: number;
  descricao?: string;
  tempoEstimado?: string;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'atendente' | 'gerente' | 'prestador' | 'admin';
  prestadorId?: string;
  ativo: boolean;
  dataCadastro: Date;
}

export interface Guia {
  id: string;
  agendamentoId: string;
  agendamento?: Agendamento;
  prestadorId: string;
  prestador?: Prestador;
  clienteId: string;
  cliente?: Cliente;
  servico: string;
  valor: number;
  codigoAutenticacao: string;
  status: 'emitida' | 'realizada' | 'faturada' | 'paga';
  dataEmissao: Date;
  dataRealizacao?: Date;
  dataFaturamento?: Date;
  dataPagamento?: Date;
}

export interface ContaPagar {
  id: string;
  prestadorId: string;
  prestador?: Prestador;
  valor: number;
  dataPagamento: Date;
  status: 'agendado' | 'pago' | 'cancelado';
  guias: string[]; // IDs das guias associadas
  createdAt: Date;
}

export interface ContaReceber {
  id: string;
  clienteId: string;
  cliente?: Cliente;
  valor: number;
  tipoPagamento: 'pix' | 'cartao' | 'dinheiro' | 'boleto';
  status: 'pendente' | 'pago' | 'cancelado';
  guias: string[]; // IDs das guias associadas
  dataPagamento?: Date;
  createdAt: Date;
}

export interface Mensagem {
  id: string;
  clienteId: string;
  usuario?: string; // ID do usuário AGENDAJA se for uma mensagem de atendente
  tipo: 'recebida' | 'enviada' | 'ia';
  texto: string;
  timestamp: Date;
  lida: boolean;
}

export interface DiaAgendaPagamento {
  data: Date;
  prestadoresAgendados: number; // número de prestadores que escolheram essa data
  disponivel: boolean; // true se prestadoresAgendados < 3
}

export interface AgendaPagamentos {
  mes: number; // 1-12
  ano: number;
  diasDisponiveis: DiaAgendaPagamento[];
}

// Estrutura para o Dashboard
export interface DadosDashboard {
  totalClientes: number;
  totalAgendamentos: number;
  totalOrcamentos: number;
  faturamentoMensal: number;
  custosOperacionais: number;
  margemLucro: number;
  agendamentosHoje: number;
  vendasHoje: number;
  mensagensNaoLidas: number;
}
