
const servicos = [
  { 
    nome: "Consulta Cardiologista",
    descricao: "Avaliação especializada e check-up completo com cardiologistas renomados.",
    preco: "R$ 250,00"
  },
  { 
    nome: "Consulta Dermatologista",
    descricao: "Diagnóstico e tratamento com especialistas em saúde da pele.",
    preco: "R$ 200,00"
  },
  { 
    nome: "Exame de Sangue",
    descricao: "Resultados rápidos e precisos para diversas finalidades.",
    preco: "R$ 120,00"
  },
  { 
    nome: "Ultrassonografia",
    descricao: "Equipamentos modernos e especialistas qualificados.",
    preco: "R$ 180,00"
  },
  { 
    nome: "Raio-X",
    descricao: "Exames com qualidade e laudo digital.",
    preco: "R$ 150,00"
  }
];

const ServicosPrincipais = () => (
  <section className="bg-agendaja-light py-12 px-4">
    <h2 className="text-3xl font-semibold text-center mb-8">Exames e Consultas Populares</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {servicos.map((servico, i) => (
        <div 
          key={i}
          className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2 items-start hover-scale border"
        >
          <h3 className="font-bold text-lg text-agendaja-primary">{servico.nome}</h3>
          <span className="text-gray-500 text-sm">{servico.descricao}</span>
          <span className="font-semibold text-agendaja-primary">{servico.preco}</span>
        </div>
      ))}
    </div>
  </section>
);

export default ServicosPrincipais;
