
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Schema para validação de cliente
export const clienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  endereco: z.string().optional(),
  id_associado: z.string().min(1, "ID do associado é obrigatório")
});

// Schema para validação de serviço
export const servicoSchema = z.object({
  nome: z.string().min(2, "Nome do serviço deve ter pelo menos 2 caracteres"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  valor_custo: z.number().positive("Valor de custo deve ser positivo"),
  valor_venda: z.number().positive("Valor de venda deve ser positivo"),
  descricao: z.string().optional(),
  tempo_estimado: z.string().optional()
});

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateCliente = (data: any) => {
    try {
      clienteSchema.parse(data);
      return { success: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive"
        });
        return { success: false, errors: error.errors };
      }
      return { success: false, errors: null };
    }
  };

  const validateServico = (data: any) => {
    try {
      servicoSchema.parse(data);
      return { success: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive"
        });
        return { success: false, errors: error.errors };
      }
      return { success: false, errors: null };
    }
  };

  return {
    validateCliente,
    validateServico
  };
};
