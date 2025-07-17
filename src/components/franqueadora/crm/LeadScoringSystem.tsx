
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface LeadScoringProps {
  lead: {
    capital_disponivel?: number;
    experiencia_empresarial?: string;
    cidade_interesse?: string;
    origem?: string;
    data_primeiro_contato?: string;
    score: number;
  };
  onScoreUpdate?: (newScore: number) => void;
}

export const LeadScoringSystem = ({ lead, onScoreUpdate }: LeadScoringProps) => {
  const calculateDetailedScore = () => {
    let score = 0;
    const factors = [];

    // Capital disponível (30 pontos)
    if (lead.capital_disponivel) {
      if (lead.capital_disponivel >= 200000) {
        score += 30;
        factors.push({ name: "Capital Alto", points: 30, type: "positive" });
      } else if (lead.capital_disponivel >= 100000) {
        score += 20;
        factors.push({ name: "Capital Médio", points: 20, type: "positive" });
      } else if (lead.capital_disponivel >= 50000) {
        score += 10;
        factors.push({ name: "Capital Baixo", points: 10, type: "neutral" });
      } else {
        factors.push({ name: "Capital Insuficiente", points: 0, type: "negative" });
      }
    }

    // Experiência empresarial (25 pontos)
    if (lead.experiencia_empresarial) {
      const experienciaLength = lead.experiencia_empresarial.length;
      if (experienciaLength > 100) {
        score += 25;
        factors.push({ name: "Experiência Detalhada", points: 25, type: "positive" });
      } else if (experienciaLength > 50) {
        score += 15;
        factors.push({ name: "Experiência Moderada", points: 15, type: "positive" });
      } else {
        score += 5;
        factors.push({ name: "Experiência Limitada", points: 5, type: "neutral" });
      }
    }

    // Origem do lead (20 pontos)
    switch (lead.origem) {
      case 'indicacao':
        score += 20;
        factors.push({ name: "Indicação", points: 20, type: "positive" });
        break;
      case 'site':
        score += 15;
        factors.push({ name: "Site Oficial", points: 15, type: "positive" });
        break;
      case 'google':
        score += 10;
        factors.push({ name: "Google", points: 10, type: "positive" });
        break;
      case 'facebook':
        score += 8;
        factors.push({ name: "Facebook", points: 8, type: "neutral" });
        break;
      default:
        score += 5;
        factors.push({ name: "Outras Fontes", points: 5, type: "neutral" });
    }

    // Localização estratégica (15 pontos)
    const cidadesEstrategicas = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador'];
    if (lead.cidade_interesse && cidadesEstrategicas.includes(lead.cidade_interesse)) {
      score += 15;
      factors.push({ name: "Cidade Estratégica", points: 15, type: "positive" });
    } else if (lead.cidade_interesse) {
      score += 8;
      factors.push({ name: "Outras Cidades", points: 8, type: "neutral" });
    }

    // Tempo de resposta (10 pontos)
    if (lead.data_primeiro_contato) {
      const diasDesdeContato = Math.floor(
        (new Date().getTime() - new Date(lead.data_primeiro_contato).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diasDesdeContato <= 1) {
        score += 10;
        factors.push({ name: "Contato Recente", points: 10, type: "positive" });
      } else if (diasDesdeContato <= 7) {
        score += 5;
        factors.push({ name: "Contato Semanal", points: 5, type: "neutral" });
      } else {
        factors.push({ name: "Contato Antigo", points: 0, type: "negative" });
      }
    }

    return { score: Math.min(score, 100), factors };
  };

  const { score, factors } = calculateDetailedScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Baixo";
  };

  React.useEffect(() => {
    if (onScoreUpdate && score !== lead.score) {
      onScoreUpdate(score);
    }
  }, [score, lead.score, onScoreUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Análise de Score
        </CardTitle>
        <CardDescription>
          Pontuação detalhada baseada em múltiplos fatores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <Badge variant={score >= 60 ? "default" : "secondary"}>
              {getScoreLabel(score)}
            </Badge>
          </div>
          <div className="flex-1">
            <Progress value={score} className="h-3" />
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Fatores de Pontuação:</h4>
          {factors.map((factor, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
              <div className="flex items-center gap-2">
                {factor.type === "positive" && <TrendingUp className="h-4 w-4 text-green-600" />}
                {factor.type === "neutral" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                {factor.type === "negative" && <TrendingDown className="h-4 w-4 text-red-600" />}
                <span className="text-sm">{factor.name}</span>
              </div>
              <Badge variant="outline">+{factor.points}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
