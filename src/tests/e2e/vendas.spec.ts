
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Vendas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    
    // Mock do login
    await page.fill('[data-testid="email-input"]', 'admin@test.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    await page.waitForURL('/dashboard');
  });

  test('deve completar fluxo de venda com sucesso', async ({ page }) => {
    // Navegar para vendas
    await page.click('[data-testid="vendas-menu"]');
    await page.waitForURL('/vendas');

    // Buscar cliente
    await page.fill('[data-testid="busca-cliente-input"]', 'João Silva');
    await page.click('[data-testid="buscar-cliente-button"]');

    // Selecionar cliente
    await page.click('[data-testid="confirmar-cliente-button"]');

    // Adicionar serviço
    await page.click('[data-testid="adicionar-servico-button"]');
    await page.selectOption('[data-testid="servico-select"]', 'consulta-medica');
    await page.selectOption('[data-testid="prestador-select"]', 'dr-silva');
    await page.fill('[data-testid="valor-input"]', '150.00');
    await page.click('[data-testid="confirmar-servico-button"]');

    // Ir para checkout
    await page.click('[data-testid="ir-checkout-button"]');

    // Finalizar venda
    await page.selectOption('[data-testid="metodo-pagamento-select"]', 'cartao');
    await page.click('[data-testid="finalizar-venda-button"]');

    // Verificar sucesso
    await expect(page.locator('[data-testid="venda-sucesso"]')).toBeVisible();
  });

  test('deve criar orçamento com sucesso', async ({ page }) => {
    await page.goto('/vendas');

    // Buscar cliente
    await page.fill('[data-testid="busca-cliente-input"]', 'Maria Santos');
    await page.click('[data-testid="buscar-cliente-button"]');

    // Selecionar cliente
    await page.click('[data-testid="confirmar-cliente-button"]');

    // Adicionar serviço
    await page.click('[data-testid="adicionar-servico-button"]');
    await page.selectOption('[data-testid="servico-select"]', 'exame-sangue');
    await page.selectOption('[data-testid="prestador-select"]', 'lab-central');
    await page.fill('[data-testid="valor-input"]', '80.00');
    await page.click('[data-testid="confirmar-servico-button"]');

    // Salvar orçamento
    await page.click('[data-testid="salvar-orcamento-button"]');

    // Verificar sucesso
    await expect(page.locator('[data-testid="orcamento-sucesso"]')).toBeVisible();
  });
});
