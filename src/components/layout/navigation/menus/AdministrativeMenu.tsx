
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Shield, 
  Settings, 
  FileText,
  Activity,
  DollarSign,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  adminOnly: boolean;
}

const menuItems: MenuItem[] = [
  {
    title: 'Financeiro',
    icon: <DollarSign className="h-4 w-4" />,
    path: '/unidade/financeiro',
    description: 'Gestão financeira e fluxo de caixa',
    adminOnly: false
  },
  {
    title: 'Colaboradores',
    icon: <UserCheck className="h-4 w-4" />,
    path: '/unidade/colaboradores',
    description: 'Gerenciar equipe e ponto eletrônico',
    adminOnly: false
  },
  {
    title: 'Meu Perfil',
    icon: <UserCheck className="h-4 w-4" />,
    path: '/unidade/perfil',
    description: 'Gerenciar perfil pessoal',
    adminOnly: false
  },
  {
    title: 'Relatórios',
    icon: <FileText className="h-4 w-4" />,
    path: '/unidade/relatorios',
    description: 'Relatórios e análises',
    adminOnly: false
  },
  {
    title: 'Gestão de Usuários',
    icon: <Users className="h-4 w-4" />,
    path: '/unidade/usuarios',
    description: 'Gerenciar usuários e permissões',
    adminOnly: true
  },
  {
    title: 'Configurações',
    icon: <Settings className="h-4 w-4" />,
    path: '/unidade/configuracoes',
    description: 'Configurações do sistema',
    adminOnly: true
  }
];

export const AdministrativeMenu: React.FC = () => {
  const { profile, isManager } = useAuth();
  
  const visibleItems = menuItems.filter(item => 
    !item.adminOnly || isManager
  );

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

// Export for backward compatibility
export const administrativeMenuItems = menuItems.map(item => ({
  title: item.title,
  icon: item.icon,
  href: item.path,
  roles: item.adminOnly ? ['admin'] : ['admin', 'gerente', 'colaborador']
}));
