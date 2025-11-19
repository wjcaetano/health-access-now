import { lazy } from 'react';

// Lazy loading para páginas pesadas
export const LazyVendas = lazy(() => import('@/pages/Vendas'));
export const LazyClientes = lazy(() => import('@/pages/Clientes'));
export const LazyPrestadores = lazy(() => import('@/pages/Prestadores'));
export const LazyServicos = lazy(() => import('@/pages/Servicos'));
export const LazyAgendamentos = lazy(() => import('@/pages/Agendamentos'));
export const LazyOrcamentos = lazy(() => import('@/pages/Orcamentos'));
export const LazyFinanceiro = lazy(() => import('@/pages/Financeiro'));
export const LazyColaboradores = lazy(() => import('@/pages/Colaboradores'));

// Lazy loading para componentes dashboard
export const LazyAdvancedDashboard = lazy(() => import('@/components/dashboard/AdvancedDashboard'));

// Lazy loading para listas
export const LazyClientesLista = lazy(() => import('@/components/clientes/OptimizedClientesLista'));
export const LazyPrestadoresLista = lazy(() => import('@/components/prestadores/PrestadoresLista'));
export const LazyServicosLista = lazy(() => import('@/components/servicos/ServicosLista'));
export const LazyVendasLista = lazy(() => import('@/components/vendas/ListaVendas'));
export const LazyAgendamentosLista = lazy(() => import('@/components/agendamentos/AgendamentosLista'));
export const LazyOrcamentosLista = lazy(() => import('@/components/orcamentos/OrcamentosLista'));

// Lazy loading para componentes de gestão
export const LazyReportsManager = lazy(() => import('@/components/reports/ReportsManager'));
export const LazyBackupManager = lazy(() => import('@/components/backup/BackupManager'));