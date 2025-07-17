
import React, { useState } from 'react';
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
import { LogIn, Menu, X } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToComoFunciona = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const section = document.getElementById('como-funciona');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
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
        
        {/* Desktop Navigation */}
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
                     <ListItem title="Consultas Médicas">
                       <Link to="/servicos/consultas-medicas" className="no-underline">
                         Encontre especialistas para cuidar da sua saúde.
                       </Link>
                     </ListItem>
                     <ListItem title="Exames Laboratoriais">
                       <Link to="/servicos/exames-laboratoriais" className="no-underline">
                         Check-ups e análises com rapidez e precisão.
                       </Link>
                     </ListItem>
                     <ListItem title="Exames de Imagem">
                       <Link to="/servicos/exames-de-imagem" className="no-underline">
                         Tecnologia de ponta para diagnósticos precisos.
                       </Link>
                     </ListItem>
                     <ListItem title="Outros Exames">
                       <Link to="/servicos/outros-exames" className="no-underline">
                         Veja a lista completa de outros procedimentos.
                       </Link>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Desktop Login Button */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <Button onClick={onAbrirLogin}>
            <LogIn className="mr-2 h-4 w-4" /> Entrar
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            <a
              href="#como-funciona"
              onClick={handleScrollToComoFunciona}
              className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            >
              Como Funciona
            </a>
            
            <div className="space-y-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-900">Serviços</div>
              <div className="pl-6 space-y-1">
                <Link
                  to="/servicos/consultas-medicas"
                  onClick={handleLinkClick}
                  className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  Consultas Médicas
                </Link>
                <Link
                  to="/servicos/exames-laboratoriais"
                  onClick={handleLinkClick}
                  className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  Exames Laboratoriais
                </Link>
                <Link
                  to="/servicos/exames-de-imagem"
                  onClick={handleLinkClick}
                  className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  Exames de Imagem
                </Link>
                <Link
                  to="/servicos/outros-exames"
                  onClick={handleLinkClick}
                  className="block px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  Outros Exames
                </Link>
              </div>
            </div>

            <Link
              to="/portal-parceiro"
              onClick={handleLinkClick}
              className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            >
              Portal do Parceiro
            </Link>
            
            <Link
              to="/seja-franqueado"
              onClick={handleLinkClick}
              className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
            >
              Seja um Franqueado
            </Link>

            <div className="pt-4 border-t">
              <Button onClick={onAbrirLogin} className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderVendas;
