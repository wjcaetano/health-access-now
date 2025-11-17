import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colaboradorSchema, type ColaboradorFormData } from "@/lib/validations";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const niveis = [
  { label: "Colaborador", value: "colaborador" },
  { label: "Atendente", value: "atendente" },
  { label: "Gerente", value: "gerente" },
  { label: "Admin", value: "admin" },
];

export default function CadastroColaborador() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [senhaProvisoria, setSenhaProvisoria] = useState<string | null>(null);
  const [showSenhaDialog, setShowSenhaDialog] = useState(false);

  const form = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues: {
      nome: "",
      email: "",
      cargo: "",
      nivel_acesso: "colaborador",
    },
  });

  const onSubmit = async (data: ColaboradorFormData) => {
    setIsLoading(true);
    try {
      console.log('Criando colaborador via Edge Function...');
      
      // Chamar Edge Function create-user
      const { data: result, error } = await supabase.functions.invoke('create-user', {
        body: {
          nome: data.nome,
          email: data.email,
          nivel_acesso: data.nivel_acesso,
          cargo: data.cargo || '',
        },
      });

      if (error) {
        console.error('Erro da Edge Function:', error);
        throw new Error(error.message || 'Erro ao criar colaborador');
      }

      console.log('Colaborador criado com sucesso:', result);

      // Exibir senha provisória no dialog
      if (result?.senha_provisoria) {
        setSenhaProvisoria(result.senha_provisoria);
        setShowSenhaDialog(true);
      }

      // Invalidar cache para atualizar lista
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });

      toast({
        title: "✅ Colaborador criado com sucesso!",
        description: "Senha provisória enviada por email e exibida abaixo.",
      });

      form.reset();
    } catch (error: any) {
      console.error('Erro ao criar colaborador:', error);
      toast({
        variant: "destructive",
        title: "❌ Erro ao criar colaborador",
        description: error.message || "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cadastrar Colaborador</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="email@exemplo.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Atendente, Recepcionista" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nivel_acesso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Acesso *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {niveis.map((n) => (
                        <SelectItem key={n.value} value={n.value}>
                          {n.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar Colaborador"}
            </Button>
          </form>
        </Form>

        {/* Dialog para exibir senha provisória */}
        <AlertDialog open={showSenhaDialog} onOpenChange={setShowSenhaDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>✅ Colaborador Criado com Sucesso!</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-4">
                  <p>O colaborador foi cadastrado e receberá um email com as credenciais de acesso.</p>
                  
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                    <p className="font-semibold text-yellow-900 mb-2">🔑 Senha Provisória Gerada:</p>
                    <code className="block bg-white px-4 py-3 rounded border border-yellow-300 text-lg font-mono text-center select-all">
                      {senhaProvisoria}
                    </code>
                    <p className="text-sm text-yellow-800 mt-2">
                      ⚠️ <strong>Importante:</strong> Esta senha foi enviada por email e deverá ser alterada no primeiro acesso.
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      setShowSenhaDialog(false);
                      setSenhaProvisoria(null);
                    }}
                    className="w-full"
                  >
                    Fechar
                  </Button>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
