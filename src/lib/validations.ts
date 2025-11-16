import { z } from 'zod';

/**
 * Utilities para validação de dados
 */

// Validar CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false; // Números repetidos
  
  // Validação do primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  // Validação do segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Validar CNPJ
export const isValidCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false; // Números repetidos
  
  // Validação do primeiro dígito
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Validação do segundo dígito
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

// Validar email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// Validar data
export const isValidDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

// Validar valor monetário
export const isValidCurrency = (value: string | number): boolean => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(numValue) && numValue >= 0;
};

// ============= ZOD SCHEMAS =============

// Validação de CPF com Zod
export const cpfSchema = z.string()
  .min(11, 'CPF deve ter 11 dígitos')
  .max(14, 'CPF inválido')
  .refine(isValidCPF, {
    message: 'CPF inválido',
  });

// Validação de CNPJ com Zod
export const cnpjSchema = z.string()
  .min(14, 'CNPJ deve ter 14 dígitos')
  .max(18, 'CNPJ inválido')
  .refine(isValidCNPJ, {
    message: 'CNPJ inválido',
  });

// Validação de telefone com Zod
export const telefoneSchema = z.string()
  .min(10, 'Telefone deve ter no mínimo 10 dígitos')
  .max(15, 'Telefone inválido')
  .refine(isValidPhone, {
    message: 'Telefone inválido (formato: (00) 00000-0000)',
  });

// Validação de email com Zod
export const emailSchema = z.string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')
  .max(255, 'Email muito longo');

// Schema completo de cliente
export const clienteSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  cpf: cpfSchema,
  email: emailSchema,
  telefone: telefoneSchema,
  endereco: z.string().default(''),
  id_associado: z.string()
    .min(3, 'ID associado deve ter no mínimo 3 caracteres')
    .max(50, 'ID associado muito longo'),
});

// Schema completo de colaborador
export const colaboradorSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: emailSchema,
  nivel_acesso: z.enum(['colaborador', 'atendente', 'gerente', 'admin'], {
    errorMap: () => ({ message: 'Nível de acesso inválido' }),
  }),
  cargo: z.string().default(''),
});

// Schema completo de prestador
export const prestadorSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .trim(),
  tipo: z.enum(['pf', 'pj'], {
    errorMap: () => ({ message: 'Tipo deve ser Pessoa Física ou Pessoa Jurídica' }),
  }),
  cnpj: cnpjSchema,
  email: emailSchema,
  telefone: telefoneSchema,
  endereco: z.string()
    .min(10, 'Endereço deve ter no mínimo 10 caracteres')
    .max(255, 'Endereço muito longo')
    .trim(),
  especialidades: z.string().array().optional(),
  banco: z.string()
    .max(100, 'Nome do banco muito longo')
    .optional()
    .or(z.literal('')),
  agencia: z.string()
    .max(20, 'Agência inválida')
    .optional()
    .or(z.literal('')),
  conta: z.string()
    .max(20, 'Conta inválida')
    .optional()
    .or(z.literal('')),
  tipo_conta: z.enum(['corrente', 'poupanca', ''], {
    errorMap: () => ({ message: 'Tipo de conta inválido' }),
  }).optional(),
  comissao: z.number()
    .min(0, 'Comissão não pode ser negativa')
    .max(100, 'Comissão não pode ser maior que 100%')
    .optional(),
});

// Schema de serviço
export const servicoSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo')
    .trim(),
  categoria: z.string()
    .min(3, 'Categoria deve ter no mínimo 3 caracteres')
    .max(50, 'Categoria muito longa')
    .trim(),
  descricao: z.string()
    .max(500, 'Descrição muito longa')
    .optional()
    .or(z.literal('')),
  valor_custo: z.number()
    .min(0, 'Valor de custo não pode ser negativo'),
  valor_venda: z.number()
    .min(0, 'Valor de venda não pode ser negativo'),
  tempo_estimado: z.string()
    .optional()
    .or(z.literal('')),
});

// Tipos TypeScript inferidos dos schemas
export type ClienteFormData = z.infer<typeof clienteSchema>;
export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;
export type PrestadorFormData = z.infer<typeof prestadorSchema>;
export type ServicoFormData = z.infer<typeof servicoSchema>;
