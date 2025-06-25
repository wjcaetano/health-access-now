import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useCreatePrestador } from "@/hooks/usePrestadores";
import ConfirmacaoCadastro from "@/components/prestadores/ConfirmacaoCadastro";

const formSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  tipo: z.enum(["clinica", "laboratorio", "profissional"]),
  especialidades: z.string().optional(),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 caracteres"),
  email: z.string().email("Email inválido"),
  banco: z.string().min(1, "Campo obrigatório"),
  agencia: z.string().min(1, "Campo obrigatório"),
  conta: z.string().min(1, "Campo obrigatório"),
  tipoConta: z.enum(["corrente", "poupanca"]),
  comissao: z.number().min(0).max(100),
});

const NovoPrestador = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPrestador = useCreatePrestador();
  const [showConfirmacao, setShowConfirmacao] = useState(false);
  const [ultimoPrestadorNome, setUltimoPrestadorNome] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      tipo: "clinica",
      especialidades: "",
      cnpj: "",
      endereco: "",
      telefone: "",
      email: "",
      banco: "",
      agencia: "",
      conta: "",
      tipoConta: "corrente",
      comissao: 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Dados do formulário:", values);
      
      // Preparar dados para inserção no banco
      const dadosPrestador = {
        nome: values.nome,
        tipo: values.tipo,
        especialidades: values.especialidades ? [values.especialidades] : null,
        cnpj: values.cnpj,
        endereco: values.endereco,
        telefone: values.telefone,
        email: values.email,
        banco: values.banco,
        agencia: values.agencia,
        conta: values.conta,
        tipo_conta: values.tipoConta,
        comissao: values.comissao,
      };

      console.log("Dados preparados para o banco:", dadosPrestador);
      
      await createPrestador.mutateAsync(dadosPrestador);
      
      setUltimoPrestadorNome(values.nome);
      setShowConfirmacao(true);
      
    } catch (error) {
      console.error("Erro ao cadastrar prestador:", error);
      toast({
        title: "Erro ao cadastrar prestador",
        description: "Ocorreu um erro ao tentar cadastrar o prestador. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCadastrarNovo = () => {
    setShowConfirmacao(false);
    form.reset();
    toast({
      title: "Formulário limpo",
      description: "Você pode cadastrar um novo prestador agora.",
    });
  };

  const handleVoltarInicio = () => {
    setShowConfirmacao(false);
    navigate("/dashboard/prestadores");
  };

  const handleCancelar = () => {
    navigate("/dashboard/prestadores");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Prestador</h2>
        <p className="text-gray-500 mt-1">
          Cadastre um novo prestador de serviços na plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Prestador</CardTitle>
          <CardDescription>
            Preencha os dados do prestador para cadastrá-lo na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Prestador</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Prestador</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="clinica">Clínica</SelectItem>
                            <SelectItem value="laboratorio">Laboratório</SelectItem>
                            <SelectItem value="profissional">Profissional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="especialidades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidades</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Cardiologia, Dermatologia..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço Completo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Rua, número, complemento, bairro, cidade, estado, CEP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-lg mb-4">Dados Bancários</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="banco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do banco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência</FormLabel>
                          <FormControl>
                            <Input placeholder="Número da agência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="conta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta</FormLabel>
                          <FormControl>
                            <Input placeholder="Número da conta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="tipoConta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Conta</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corrente">Conta Corrente</SelectItem>
                              <SelectItem value="poupanca">Conta Poupança</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comissao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comissão AGENDAJA (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={handleCancelar}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-agendaja-primary hover:bg-agendaja-secondary"
                  disabled={createPrestador.isPending}
                >
                  {createPrestador.isPending ? "Cadastrando..." : "Cadastrar Prestador"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmacaoCadastro
        isOpen={showConfirmacao}
        onClose={() => setShowConfirmacao(false)}
        onCadastrarNovo={handleCadastrarNovo}
        onVoltarInicio={handleVoltarInicio}
        nomePrestador={ultimoPrestadorNome}
      />
    </div>
  );
};

export default NovoPrestador;
