
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateServico } from "@/hooks/useServicos";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  valorCusto: z.number().min(0, "O valor deve ser maior que zero"),
  valorVenda: z.number().min(0, "O valor deve ser maior que zero"),
  descricao: z.string().optional(),
  tempoEstimado: z.string().optional(),
  ativo: z.boolean().default(true)
});

const NovoServico = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { mutate: criarServico } = useCreateServico();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      valorCusto: 0,
      valorVenda: 0,
      descricao: "",
      tempoEstimado: "",
      ativo: true
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    criarServico({
      nome: values.nome,
      categoria: values.categoria,
      valor_custo: values.valorCusto,
      valor_venda: values.valorVenda,
      descricao: values.descricao || null,
      tempo_estimado: values.tempoEstimado || null,
      ativo: values.ativo
    }, {
      onSuccess: () => {
        toast({
          title: "Serviço cadastrado com sucesso!",
          description: `${values.nome} foi adicionado como serviço.`,
        });
        navigate("/servicos");
      },
      onError: (error) => {
        toast({
          title: "Erro ao cadastrar serviço",
          description: "Ocorreu um erro ao cadastrar o serviço. Tente novamente.",
          variant: "destructive"
        });
        console.error('Erro ao cadastrar serviço:', error);
      }
    });
  };

  // Calcular valor de venda sugerido baseado no custo (margem de 30%)
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'valorCusto') {
        const valorCusto = Number(value.valorCusto);
        if (valorCusto > 0) {
          const valorVendaSugerido = valorCusto * 1.3; // 30% de margem
          form.setValue('valorVenda', Math.round(valorVendaSugerido * 100) / 100);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Serviço</h2>
        <p className="text-gray-500 mt-1">
          Cadastre um novo serviço na plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Serviço</CardTitle>
          <CardDescription>
            Preencha os dados do serviço para cadastrá-lo na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Serviço</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Consulta Cardiologista" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Consulta">Consulta</SelectItem>
                          <SelectItem value="Exame">Exame</SelectItem>
                          <SelectItem value="Procedimento">Procedimento</SelectItem>
                          <SelectItem value="Cirurgia">Cirurgia</SelectItem>
                          <SelectItem value="Terapia">Terapia</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valorCusto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Custo (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valorVenda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Venda (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          min="0" 
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500">
                        Valor sugerido automaticamente com base no custo
                      </p>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Serviço</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o serviço com detalhes" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tempoEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tempo Estimado</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 30 minutos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativo</FormLabel>
                        <p className="text-sm text-gray-500">
                          Serviço disponível para uso
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate("/servicos")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-agendaja-primary hover:bg-agendaja-secondary">
                  Cadastrar Serviço
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovoServico;
