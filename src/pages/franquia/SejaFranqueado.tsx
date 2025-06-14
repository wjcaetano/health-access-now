
import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";

const SejaFranqueado = () => {
    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            <main className="container mx-auto px-4 py-12">
                 <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-agendaja-primary mb-4">Seja um Franqueado Agenda Já</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Leve para sua cidade um modelo de negócio inovador, tecnológico e com alto impacto social na área da saúde.
                    </p>
                    <div className="mb-10">
                        <img src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=800&q=80" alt="Negócios" className="rounded-lg shadow-xl mx-auto" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Por que investir em uma franquia Agenda Já?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        O mercado de saúde acessível está em plena expansão. Com a Agenda Já, você entra em um setor promissor com uma marca forte, suporte completo, tecnologia de ponta e baixo investimento inicial.
                    </p>
                    <Button size="lg" onClick={() => alert('Página de contato de franquia em breve!')}>
                        Quero mais informações
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default SejaFranqueado;
