
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
import { Label } from "@/components/ui/label";
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
import { 
  Switch 
} from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Prestador } from "@/types";

// Dados fictícios para demonstração
const prestadores: Prestador[] = [
  {
    id: "prest-001",
    nome: "Clínica CardioSaúde",
    tipo: "clinica",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua das Palmeiras, 123 - Centro",
    telefone: "(11) 99999-8888",
    email: "contato@cardiosaude.com",
    contaBancaria: {
      banco: "Banco do Brasil",
      agencia: "1234",
      conta: "56789-0",
      tipoConta: "corrente"
    },
    comissao: 15,
    dataCadastro: new Date(2023, 1, 15),
    ativo: true
  },
  {
    id: "prest-002",
    nome: "Laboratório Análises Clínicas",
    tipo: "laboratorio",
    cnpj: "98.765.432/0001-10",
    endereco: "Avenida Brasil, 500 - Jardim América",
    telefone: "(11) 3333-4444",
    email: "lab@analisesclinicas.com",
    contaBancaria: {
      banco: "Itaú",
      agencia: "5678",
      conta: "12345-6",
      tipoConta: "corrente"
    },
    comissao: 12,
    dataCadastro: new Date(2022, 11, 7),
    ativo: true
  },
  {
    id: "prest-003",
    nome: "Dra. Ana Silva",
    tipo: "profissional",
    especialidades: ["Dermatologia", "Dermatologia Estética"],
    cnpj: "76.543.210/0001-54",
    endereco: "Rua Flores, 29 - Jardim Paulista",
    telefone: "(11) 97777-6666",
    email: "dra.anasilva@dermaclinica.com",
    contaBancaria: {
      banco: "Santander",
      agencia: "9876",
      conta: "54321-0",
      tipoConta: "poupanca"
    },
    comissao: 10,
    dataCadastro: new Date(2023, 3, 22),
    ativo: true
  }
];

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  prestadorId: z.string().min(1, "Selecione um prestador"),
  valorCusto: z.number().min(0, "O valor deve ser maior que zero"),
  valorVenda: z.number().min(0, "O valor deve ser maior que zero"),
  descricao: z.string().optional(),
  tempoEstimado: z.string().optional(),
  ativo: z.boolean().default(true)
});

const NovoServico = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      prestadorId: "",
      valorCusto: 0,
      valorVenda: 0,
      descricao: "",
      tempoEstimado: "",
      ativo: true
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const prestador = prestadores.find(p => p.id === values.prestadorId);
    console.log("Dados do serviço:", { ...values, prestador });
    
    toast({
      title: "Serviço cadastrado com sucesso!",
      description: `${values.nome} foi adicionado como serviço.`,
    });
  };

  // Calcular valor de venda quando o valor de custo ou prestador muda
  const calcularValorVenda = (valorCusto: number, prestadorId: string) => {
    const prestador = prestadores.find(p => p.id === prestadorId);
    if (prestador && valorCusto > 0) {
      const comissao = prestador.comissao / 100;
      const valorVenda = valorCusto * (1 + comissao);
      return Math.round(valorVenda * 100) / 100; // Arredonda para 2 casas decimais
    }
    return 0;
  };

  // Atualiza o valor de venda quando o valor de custo ou prestador mudar
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'valorCusto' || name === 'prestadorId') {
        const valorCusto = Number(value.valorCusto);
        const prestadorId = String(value.prestadorId);
        
        if (valorCusto > 0 && prestadorId) {
          const novoValor = calcularValorVenda(valorCusto, prestadorId);
          form.setValue('valorVenda', novoValor);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, form.watch]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Serviço</h2>
        <p className="text-gray-500 mt-1">
          Cadastre um novo serviço oferecido por um prestador
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
              <FormField
                control={form.control}
                name="prestadorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prestador</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o prestador" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prestadores.map((prestador) => (
                          <SelectItem key={prestador.id} value={prestador.id}>
                            {prestador.nome} ({prestador.tipo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        Valor calculado com base no custo e na comissão do prestador
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
                          Serviço disponível para agendamento
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
                <Button variant="outline" type="button">
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
