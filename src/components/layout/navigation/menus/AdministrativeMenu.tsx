
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Settings, 
  FileText,
  TestTube,
  BookOpen,
  Activity,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const administrativeMenuItems = [
  {
    title: 'Financeiro',
    icon: DollarSign,
    href: '/sistema/financeiro',
    roles: ['admin', 'gerente']
  },
  {
    title: 'Agenda Pagamentos',
    icon: Activity,
    href: '/sistema/agenda-pagamentos',
    roles: ['admin', 'gerente']
  },
  {
    title: 'Gestão de Usuários',
    icon: Users,
    href: '/sistema/usuarios',
    roles: ['admin']
  },
  {
    title: 'Colaboradores',
    icon: UserCheck,
    href: '/sistema/colaboradores',
    roles: ['admin', 'gerente']
  },
  {
    title: 'Meu Perfil',
    icon: UserCheck,
    href: '/sistema/perfil',
    roles: ['admin', 'gerente', 'colaborador']
  },
  {
    title: 'Segurança',
    icon: Shield,
    href: '/sistema/security',
    roles: ['admin']
  },
  {
    title: 'Qualidade',
    icon: TestTube,
    href: '/sistema/quality',
    roles: ['admin']
  },
  {
    title: 'Documentação',
    icon: BookOpen,
    href: '/sistema/documentation',
    roles: ['admin', 'gerente', 'colaborador']
  },
  {
    title: 'Relatórios',
    icon: FileText,
    href: '/sistema/relatorios',
    roles: ['admin', 'gerente']
  },
  {
    title: 'Backup',
    icon: Shield,
    href: '/sistema/backup',
    roles: ['admin']
  },
  {
    title: 'Análise do Sistema',
    icon: Activity,
    href: '/sistema/analise-sistema',
    roles: ['admin']
  },
  {
    title: 'Dashboard Avançado',
    icon: Activity,
    href: '/sistema/dashboard-avancado',
    roles: ['admin', 'gerente']
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/sistema/configuracoes',
    roles: ['admin']
  }
];

export const AdministrativeMenu: React.FC = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      title: 'Financeiro',
      icon: <DollarSign className="h-4 w-4" />,
      path: '/sistema/financeiro',
      description: 'Gestão financeira e fluxo de caixa',
      adminOnly: false
    },
    {
      title: 'Agenda Pagamentos',
      icon: <Activity className="h-4 w-4" />,
      path: '/sistema/agenda-pagamentos',
      description: 'Agenda de pagamentos e cobranças',
      adminOnly: false
    },
    {
      title: 'Gestão de Usuários',
      icon: <Users className="h-4 w-4" />,
      path: '/sistema/usuarios',
      description: 'Gerenciar usuários e permissões',
      adminOnly: true
    },
    {
      title: 'Colaboradores',
      icon: <UserCheck className="h-4 w-4" />,
      path: '/sistema/colaboradores',
      description: 'Gerenciar equipe e ponto eletrônico',
      adminOnly: false
    },
    {
      title: 'Meu Perfil',
      icon: <UserCheck className="h-4 w-4" />,
      path: '/sistema/perfil',
      description: 'Gerenciar perfil pessoal',
      adminOnly: false
    },
    {
      title: 'Segurança',
      icon: <Shield className="h-4 w-4" />,
      path: '/sistema/security',
      description: 'Auditoria e logs de segurança',
      adminOnly: true
    },
    {
      title: 'Qualidade',
      icon: <TestTube className="h-4 w-4" />,
      path: '/sistema/quality',
      description: 'Testes e métricas de qualidade',
      adminOnly: true
    },
    {
      title: 'Documentação',
      icon: <BookOpen className="h-4 w-4" />,
      path: '/sistema/documentation',
      description: 'Documentação técnica e style guide',
      adminOnly: false
    },
    {
      title: 'Relatórios',
      icon: <FileText className="h-4 w-4" />,
      path: '/sistema/relatorios',
      description: 'Relatórios e análises',
      adminOnly: false
    },
    {
      title: 'Backup',
      icon: <Shield className="h-4 w-4" />,
      path: '/sistema/backup',
      description: 'Backup e restauração',
      adminOnly: true
    },
    {
      title: 'Análise do Sistema',
      icon: <Activity className="h-4 w-4" />,
      path: '/sistema/analise-sistema',
      description: 'Análise de performance',
      adminOnly: true
    },
    {
      title: 'Dashboard Avançado',
      icon: <Activity className="h-4 w-4" />,
      path: '/sistema/dashboard-avancado',
      description: 'Dashboard com métricas avançadas',
      adminOnly: false
    },
    {
      title: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
      path: '/sistema/configuracoes',
      description: 'Configurações do sistema',
      adminOnly: true
    }
  ];

  const visibleItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Administrativo
      </h3>
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            {item.icon}
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
