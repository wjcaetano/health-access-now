
import { describe, it, expect } from 'vitest';
import { formatCPF, formatCNPJ, formatPhone, formatCurrency } from '@/lib/formatters';

describe('Formatters', () => {
  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('deve lidar com CPF já formatado', () => {
      expect(formatCPF('123.456.789-01')).toBe('123.456.789-01');
    });

    it('deve lidar com CPF inválido', () => {
      expect(formatCPF('123')).toBe('123');
    });
  });

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ corretamente', () => {
      expect(formatCNPJ('12345678000195')).toBe('12.345.678/0001-95');
    });

    it('deve lidar com CNPJ já formatado', () => {
      expect(formatCNPJ('12.345.678/0001-95')).toBe('12.345.678/0001-95');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone celular', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('deve formatar telefone fixo', () => {
      expect(formatPhone('1134567890')).toBe('(11) 3456-7890');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar moeda brasileira', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('deve lidar com valor zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });
  });
});
