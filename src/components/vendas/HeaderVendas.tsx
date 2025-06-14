
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LogIn } from 'lucide-react';

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

interface HeaderVendasProps {
  onAbrirLogin?: () => void;
}

const HeaderVendas: React.FC<HeaderVendasProps> = ({ onAbrirLogin }) => {
  const navigate = useNavigate();

  const handleScrollToComoFunciona = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const section = document.getElementById('como-funciona');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block text-lg text-agendaja-primary">
              Agenda Já
            </span>
          </Link>
        </div>
        <div className="hidden md:flex flex-grow justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <a href="#como-funciona" onClick={handleScrollToComoFunciona} className={navigationMenuTriggerStyle()}>
                  Como Funciona
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Serviços</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                     <ListItem href="/servicos/consultas" title="Consultas Médicas">
                       Encontre especialistas para cuidar da sua saúde.
                     </ListItem>
                     <ListItem href="/servicos/exames-laboratoriais" title="Exames Laboratoriais">
                       Check-ups e análises com rapidez e precisão.
                     </ListItem>
                     <ListItem href="/servicos/exames-imagem" title="Exames de Imagem">
                       Tecnologia de ponta para diagnósticos precisos.
                     </ListItem>
                     <ListItem href="/servicos/outros-exames" title="Outros Exames">
                       Veja a lista completa de outros procedimentos.
                     </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/portal-parceiro" className={navigationMenuTriggerStyle()}>
                  Portal do Parceiro
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/seja-franqueado" className={navigationMenuTriggerStyle()}>
                  Seja um Franqueado
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button onClick={onAbrirLogin}>
            <LogIn className="mr-2 h-4 w-4" /> Entrar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderVendas;
