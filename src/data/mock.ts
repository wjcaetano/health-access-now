
import { Cliente, Agendamento, Orcamento } from "@/types";

// Função para gerar ID único
const generateId = () => Math.random().toString(36).substring(2, 15);

// Função para gerar data aleatória nos últimos 30 dias
const randomDate = (start: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: Date = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Função para gerar código de autenticação
const generateAuthCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

// Lista de clientes mockados
export const clientes: Cliente[] = [
  {
    id: generateId(),
    nome: "Maria Silva",
    cpf: "123.456.789-00",
    telefone: "(11) 99999-8888",
    email: "maria@email.com",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataCadastro: randomDate(),
    idAssociado: "MS" + generateId().toUpperCase().substring(0, 6)
  },
  {
    id: generateId(),
    nome: "João Santos",
    cpf: "987.654.321-00",
    telefone: "(11) 98888-7777",
    email: "joao@email.com",
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    dataCadastro: randomDate(),
    idAssociado: "JS" + generateId().toUpperCase().substring(0, 6)
  },
  {
    id: generateId(),
    nome: "Ana Oliveira",
    cpf: "456.789.123-00",
    telefone: "(11) 97777-6666",
    email: "ana@email.com",
    endereco: "Rua Augusta, 500 - São Paulo, SP",
    dataCadastro: randomDate(),
    idAssociado: "AO" + generateId().toUpperCase().substring(0, 6)
  },
  {
    id: generateId(),
    nome: "Carlos Ferreira",
    cpf: "111.222.333-44",
    telefone: "(11) 96666-5555",
    email: "carlos@email.com",
    endereco: "Rua Oscar Freire, 200 - São Paulo, SP",
    dataCadastro: randomDate(),
    idAssociado: "CF" + generateId().toUpperCase().substring(0, 6)
  },
  {
    id: generateId(),
    nome: "Patricia Mendes",
    cpf: "333.444.555-66",
    telefone: "(11) 95555-4444",
    email: "patricia@email.com",
    endereco: "Av. Rebouças, 800 - São Paulo, SP",
    dataCadastro: randomDate(),
    idAssociado: "PM" + generateId().toUpperCase().substring(0, 6)
  }
];

// Lista de clínicas mockadas
const clinicas = [
  "Clínica São Lucas",
  "Hospital Santa Maria",
  "Centro Médico Paulista",
  "Laboratório Diagnósticos",
  "Clínica Bem Estar"
];

// Lista de profissionais mockados
const profissionais = [
  "Dr. Roberto Almeida",
  "Dra. Camila Santos",
  "Dr. Marcelo Costa",
  "Dra. Juliana Pereira",
  "Dr. Fernando Oliveira"
];

// Lista de serviços mockados
const servicos = [
  "Consulta Cardiologia",
  "Exame de Sangue",
  "Ultrassonografia",
  "Consulta Dermatologia",
  "Raio-X",
  "Consulta Oftalmologia",
  "Exame de Urina"
];

// Gerar lista de agendamentos mockados
export const agendamentos: Agendamento[] = clientes.flatMap(cliente => {
  // Cada cliente pode ter até 3 agendamentos
  return Array(Math.floor(Math.random() * 3) + 1).fill(null).map(() => {
    const dataAgendamento = randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    const hour = Math.floor(Math.random() * 9) + 8; // Entre 8h e 17h
    const minute = Math.random() > 0.5 ? "00" : "30";
    const horario = `${hour.toString().padStart(2, '0')}:${minute}`;
    
    const statusOptions: Agendamento['status'][] = ['agendado', 'confirmado', 'cancelado', 'realizado'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    return {
      id: generateId(),
      clienteId: cliente.id,
      cliente: cliente,
      dataAgendamento: dataAgendamento,
      horario: horario,
      clinica: clinicas[Math.floor(Math.random() * clinicas.length)],
      profissional: profissionais[Math.floor(Math.random() * profissionais.length)],
      servico: servicos[Math.floor(Math.random() * servicos.length)],
      status: randomStatus,
      codigoAutenticacao: generateAuthCode(),
      createdAt: randomDate(new Date(dataAgendamento.getTime() - 15 * 24 * 60 * 60 * 1000), dataAgendamento)
    };
  });
});

// Gerar lista de orçamentos mockados
export const orcamentos: Orcamento[] = clientes.flatMap(cliente => {
  // Cada cliente pode ter até 2 orçamentos
  return Array(Math.floor(Math.random() * 2) + 1).fill(null).map(() => {
    const valorCusto = Math.floor(Math.random() * 30000) + 5000; // Entre R$ 50 e R$ 350
    const percentualDesconto = Math.floor(Math.random() * 30) + 5; // Entre 5% e 35%
    const valorVenda = Math.round(valorCusto * (1 + 0.2)); // Margem de 20%
    const valorFinal = Math.round(valorVenda * (1 - percentualDesconto / 100));
    
    const createdAt = randomDate();
    const dataValidade = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 dias de validade
    
    const statusOptions: Orcamento['status'][] = ['pendente', 'aprovado', 'recusado', 'expirado'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    return {
      id: generateId(),
      clienteId: cliente.id,
      cliente: cliente,
      servico: servicos[Math.floor(Math.random() * servicos.length)],
      clinica: clinicas[Math.floor(Math.random() * clinicas.length)],
      valorCusto: valorCusto,
      valorVenda: valorVenda,
      percentualDesconto: percentualDesconto,
      valorFinal: valorFinal,
      dataValidade: dataValidade,
      status: randomStatus,
      createdAt: createdAt
    };
  });
});
