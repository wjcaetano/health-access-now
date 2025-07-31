
import React from 'react';
import { Check, Building2 } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { useUnidades } from '@/hooks/useTenants';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const TenantSelector: React.FC = () => {
  const { currentTenant, switchTenant, hasMultipleTenants } = useTenant();
  const { data: tenants = [] } = useUnidades();
  const { profile } = useAuth();

  if (!hasMultipleTenants || !profile) {
    return null;
  }

  const accessibleTenants = tenants.filter(tenant => 
    tenant.id === profile.unidade_id || 
    tenant.unidade_matriz_id === profile.unidade_id
  );

  if (accessibleTenants.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentTenant?.nome || 'Selecionar Contexto'}
          </span>
          <Badge variant="secondary" className="hidden sm:inline">
            {currentTenant?.tipo}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {accessibleTenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => switchTenant(tenant.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{tenant.nome}</span>
              <span className="text-sm text-muted-foreground">
                {tenant.tipo} • {tenant.codigo}
              </span>
            </div>
            {currentTenant?.id === tenant.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
