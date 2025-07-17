
/**
 * Utilitários para manipulação de números de pedido
 */

/**
 * Gera um número de pedido baseado no ID da venda
 * Formato: AG + timestamp + sequencial (ex: AG240126001)
 */
export function gerarNumeroPedido(vendaId: string): string {
  // Usar os primeiros 8 caracteres do UUID como base para um número mais legível
  const baseId = vendaId.replace(/-/g, '').slice(0, 8).toUpperCase();
  return `AG${baseId}`;
}

/**
 * Extrai o número do pedido a partir de um venda_id
 */
export function extrairNumeroPedido(vendaId: string): string {
  if (!vendaId) return 'N/A';
  return gerarNumeroPedido(vendaId);
}

/**
 * Valida se um número de pedido está no formato correto
 */
export function validarNumeroPedido(numeroPedido: string): boolean {
  return /^AG[A-F0-9]{8}$/.test(numeroPedido);
}

/**
 * Formata dados de pedido para exibição
 */
export function formatarDadosPedido(vendaInfo: any) {
  if (!vendaInfo) {
    return {
      numeroPedido: 'N/A',
      valorTotal: 0,
      metodoPagamento: 'N/A',
      dataVenda: null
    };
  }

  return {
    numeroPedido: extrairNumeroPedido(vendaInfo.venda_id),
    valorTotal: vendaInfo.vendas?.valor_total || 0,
    metodoPagamento: vendaInfo.vendas?.metodo_pagamento || 'N/A',
    dataVenda: vendaInfo.vendas?.created_at || null
  };
}
