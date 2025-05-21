
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
