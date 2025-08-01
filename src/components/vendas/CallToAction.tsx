
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SelecaoUnidadeModal from "@/components/vendas/SelecaoUnidadeModal";

const CallToAction = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="w-full py-16 flex flex-col items-center bg-gradient-to-tr from-agendaja-primary/95 to-agendaja-secondary/80 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Pronto(a) para cuidar da sua saúde de forma fácil e econômica?
      </h2>
      <p className="text-white/90 text-lg mb-8">
        Agende agora mesmo consultas e exames com conforto, agilidade e preços justos.
      </p>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="text-lg bg-white text-agendaja-primary hover:bg-agendaja-secondary hover:text-white shadow-lg"
            onClick={() => setModalOpen(true)}
          >
            Agendar Exame ou Consulta
          </Button>
        </DialogTrigger>
        <SelecaoUnidadeModal tipoServico="Consulta ou Exame" />
      </Dialog>
    </section>
  );
};

export default CallToAction;
