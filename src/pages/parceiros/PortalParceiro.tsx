
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { useState } from "react";

const PortalParceiro = () => {
    const { toast } = useToast();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
        toast({
            title: "Cadastro Enviado!",
            description: "Obrigado pelo interesse! Entraremos em contato em breve.",
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold text-agendaja-primary mb-4 text-center">Seja um Parceiro Agenda Já</h1>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Junte-se à nossa rede de clínicas, laboratórios e profissionais de saúde. Aumente sua visibilidade, otimize sua agenda e receba novos pacientes através da nossa plataforma.
                    </p>

                    {submitted ? (
                         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-center">
                            <h3 className="font-bold">Cadastro recebido com sucesso!</h3>
                            <p>Nossa equipe analisará suas informações e entrará em contato em breve.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Formulário de Interesse</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nome">Nome do Responsável</Label>
                                    <Input id="nome" placeholder="Seu nome completo" required />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email de Contato</Label>
                                    <Input id="email" type="email" placeholder="seu@email.com" required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="clinica">Nome da Clínica/Laboratório</Label>
                                <Input id="clinica" placeholder="Nome do seu estabelecimento" required />
                            </div>
                             <div>
                                <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                                <Input id="telefone" placeholder="(XX) XXXXX-XXXX" required />
                            </div>
                            <Button type="submit" className="w-full" size="lg">Quero ser um parceiro</Button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PortalParceiro;
