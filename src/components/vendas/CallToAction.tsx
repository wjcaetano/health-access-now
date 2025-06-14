
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full py-16 flex flex-col items-center bg-gradient-to-tr from-agendaja-primary/95 to-agendaja-secondary/80 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Pronto(a) para cuidar da sua saúde de forma fácil e econômica?
      </h2>
      <p className="text-white/90 text-lg mb-8">
        Agende agora mesmo consultas e exames com conforto, agilidade e preços justos.
      </p>
      <Button
        size="lg"
        className="text-lg bg-white text-agendaja-primary hover:bg-agendaja-secondary hover:text-white shadow-lg"
        onClick={() => navigate("/novo-cliente")}
      >
        Agendar Exame ou Consulta
      </Button>
    </section>
  );
};

export default CallToAction;
