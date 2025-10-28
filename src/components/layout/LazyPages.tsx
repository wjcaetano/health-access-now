
import { lazy } from 'react';

// Lazy loading das páginas principais
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyClientes = lazy(() => import('@/pages/Clientes'));
export const LazyNovoCliente = lazy(() => import('@/pages/NovoCliente'));
export const LazyPrestadores = lazy(() => import('@/pages/Prestadores'));
export const LazyNovoPrestador = lazy(() => import('@/pages/NovoPrestador'));
export const LazyServicos = lazy(() => import('@/pages/Servicos'));
export const LazyNovoServico = lazy(() => import('@/pages/NovoServico'));
export const LazyOrcamentos = lazy(() => import('@/pages/Orcamentos'));
export const LazyVisualizarOrcamento = lazy(() => import('@/pages/VisualizarOrcamento'));
export const LazyVendas = lazy(() => import('@/pages/Vendas'));
export const LazyVendaFinalizada = lazy(() => import('@/pages/VendaFinalizada'));
export const LazyAgendamentos = lazy(() => import('@/pages/Agendamentos'));
export const LazyNovoAgendamento = lazy(() => import('@/pages/NovoAgendamento'));
export const LazyColaboradores = lazy(() => import('@/pages/Colaboradores'));
export const LazyFinanceiro = lazy(() => import('@/pages/Financeiro'));
export const LazyAgendaPagamentos = lazy(() => import('@/pages/AgendaPagamentos'));
export const LazyMeuPerfil = lazy(() => import('@/pages/MeuPerfil'));
export const LazyAdvancedDashboardPage = lazy(() => import('@/pages/AdvancedDashboard'));
export const LazyReportsPage = lazy(() => import('@/pages/ReportsPage'));
export const LazyBackupPage = lazy(() => import('@/pages/BackupPage'));
export const LazySystemSettings = lazy(() => import('@/pages/SystemSettings'));

// Prestador pages
export const LazyPortalPrestador = lazy(() => import('@/pages/prestador/Portal'));
export const LazyGuiasPrestador = lazy(() => import('@/pages/prestador/Guias'));
export const LazyFaturamentoPrestador = lazy(() => import('@/pages/prestador/Faturamento'));

// Cliente pages
export const LazyPortalCliente = lazy(() => import('@/pages/clientes/PortalCliente'));

// Portais com Lazy Loading
export const LazyHubPortal = lazy(() => import('@/components/portals/HubPortal'));
export const LazyPrestadorPortal = lazy(() => import('@/components/portals/PrestadorPortal'));
