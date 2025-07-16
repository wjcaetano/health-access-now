
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
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const AdministrativeMenu: React.FC = () => {
  const { isAdmin } = useAuth();

  const menuItems = [
    {
      title: 'Gestão de Usuários',
      icon: <Users className="h-4 w-4" />,
      path: '/gestao-usuarios',
      description: 'Gerenciar usuários e permissões',
      adminOnly: true
    },
    {
      title: 'Colaboradores',
      icon: <UserCheck className="h-4 w-4" />,
      path: '/colaboradores',
      description: 'Gerenciar equipe e ponto eletrônico',
      adminOnly: false
    },
    {
      title: 'Segurança',
      icon: <Shield className="h-4 w-4" />,
      path: '/security',
      description: 'Auditoria e logs de segurança',
      adminOnly: true
    },
    {
      title: 'Qualidade',
      icon: <TestTube className="h-4 w-4" />,
      path: '/quality',
      description: 'Testes e métricas de qualidade',
      adminOnly: true
    },
    {
      title: 'Documentação',
      icon: <BookOpen className="h-4 w-4" />,
      path: '/documentation',
      description: 'Documentação técnica e style guide',
      adminOnly: false
    },
    {
      title: 'Configurações',
      icon: <Settings className="h-4 w-4" />,
      path: '/configuracoes',
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
