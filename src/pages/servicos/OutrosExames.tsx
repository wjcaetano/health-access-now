import { Button } from "@/components/ui/button";
import HeaderVendas from "@/components/vendas/HeaderVendas";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SelecaoUnidadeModal from "@/components/vendas/SelecaoUnidadeModal";

const exames = ["Eletrocardiograma (ECG)", "Teste Ergométrico", "Endoscopia", "Colonoscopia", "MAPA 24h", "Holter 24h"];

const OutrosExames = () => {
    return (
        <div className="bg-white min-h-screen">
            <HeaderVendas />
            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-agendaja-primary mb-4">Outros Exames</h1>
                <p className="text-lg text-gray-600 mb-8">Conheça outros procedimentos e exames disponíveis para um cuidado completo com a sua saúde.</p>
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Exames Adicionais:</h2>
                    <div className="flex flex-wrap gap-2">
                        {exames.map(exame => (
                            <span key={exame} className="bg-agendaja-light text-agendaja-primary font-medium py-1 px-3 rounded-full">{exame}</span>
                        ))}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg">
                            Agendar Outro Exame
                        </Button>
                    </DialogTrigger>
                    <SelecaoUnidadeModal tipoServico="Exame" />
                </Dialog>
            </main>
        </div>
    );
}

export default OutrosExames;
