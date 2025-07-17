
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Type, Layout, Code, Zap, Check } from 'lucide-react';

export default function StyleGuide() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AgendaJá - Style Guide</h1>
        <p className="text-muted-foreground">Guia de estilo e componentes do sistema</p>
      </div>

      {/* Cores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-full h-20 bg-primary rounded-lg mb-2"></div>
              <div className="text-sm font-medium">Primary</div>
              <div className="text-xs text-muted-foreground">hsl(var(--primary))</div>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-secondary rounded-lg mb-2"></div>
              <div className="text-sm font-medium">Secondary</div>
              <div className="text-xs text-muted-foreground">hsl(var(--secondary))</div>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-accent rounded-lg mb-2"></div>
              <div className="text-sm font-medium">Accent</div>
              <div className="text-xs text-muted-foreground">hsl(var(--accent))</div>
            </div>
            <div className="text-center">
              <div className="w-full h-20 bg-destructive rounded-lg mb-2"></div>
              <div className="text-sm font-medium">Destructive</div>
              <div className="text-xs text-muted-foreground">hsl(var(--destructive))</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipografia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
            <code className="text-sm bg-muted px-2 py-1 rounded">text-4xl font-bold</code>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Heading 2</h2>
            <code className="text-sm bg-muted px-2 py-1 rounded">text-3xl font-bold</code>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Heading 3</h3>
            <code className="text-sm bg-muted px-2 py-1 rounded">text-2xl font-bold</code>
          </div>
          <div>
            <p className="text-base mb-2">Texto padrão do sistema</p>
            <code className="text-sm bg-muted px-2 py-1 rounded">text-base</code>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Texto secundário</p>
            <code className="text-sm bg-muted px-2 py-1 rounded">text-sm text-muted-foreground</code>
          </div>
        </CardContent>
      </Card>

      {/* Componentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5" />
            Componentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Botões */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Botões</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <Input placeholder="Input padrão" />
              <Input type="email" placeholder="Email" />
              <Input type="password" placeholder="Senha" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Opção 1</SelectItem>
                  <SelectItem value="option2">Opção 2</SelectItem>
                  <SelectItem value="option3">Opção 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Padrões de Código */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Padrões de Código
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Estrutura de Componentes</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Exemplo de componente bem estruturado
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExample } from '@/hooks/useExample';

interface ExampleProps {
  id: string;
  name: string;
  onAction: (id: string) => void;
}

export default function Example({ id, name, onAction }: ExampleProps) {
  const { data, loading, error } = useExample(id);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onAction(id)}>
          Ação
        </Button>
      </CardContent>
    </Card>
  );
}`}
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Padrões de Hooks</h3>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`// Exemplo de hook customizado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useExample() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('example')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: CreateItemData) => {
      const { data, error } = await supabase
        .from('example')
        .insert([newItem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['example'] });
    },
  });

  return {
    data,
    isLoading,
    error,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Boas Práticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Boas Práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Componentes Pequenos e Focados</div>
                <div className="text-sm text-muted-foreground">
                  Mantenha componentes com responsabilidade única e máximo de 100 linhas
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">TypeScript Rigoroso</div>
                <div className="text-sm text-muted-foreground">
                  Sempre defina tipos e interfaces, evite 'any'
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Tratamento de Erros</div>
                <div className="text-sm text-muted-foreground">
                  Sempre trate erros e estados de loading
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Acessibilidade</div>
                <div className="text-sm text-muted-foreground">
                  Use semantic HTML e ARIA labels quando necessário
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <div className="font-medium">Performance</div>
                <div className="text-sm text-muted-foreground">
                  Use React.memo, useMemo e useCallback quando apropriado
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
