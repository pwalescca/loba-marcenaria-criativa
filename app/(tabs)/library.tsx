import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface WoodInfo {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  uses: string[];
  curiosities: string[];
  color: string;
}

const WOODS: WoodInfo[] = [
  {
    id: "pinus",
    name: "Pinus",
    description:
      "Madeira de reflorestamento originária de regiões temperadas. O Pinus é uma das madeiras mais utilizadas no Brasil devido ao seu crescimento rápido e custo acessível.",
    characteristics: [
      "Cor: Bege a amarelada",
      "Densidade: Baixa a média",
      "Dureza: Macia",
      "Resistência: Moderada",
      "Trabalhabilidade: Excelente",
    ],
    uses: [
      "Móveis",
      "Estruturas leves",
      "Decoração",
      "Papel e celulose",
      "Construção civil",
      "Embalagens",
    ],
    curiosities: [
      "O Pinheiro Bristlecone é uma das árvores mais antigas do mundo, com exemplares que ultrapassam 5.000 anos",
      "Cresce rapidamente sem necessidade de solo rico em nutrientes",
      "Impregnada com resina, ganha maior resistência",
      "Muito usada em marcenaria e carpintaria exterior",
    ],
    color: "#D4A574",
  },
  {
    id: "eucalipto",
    name: "Eucalipto",
    description:
      "Madeira de reflorestamento originária da Austrália. O Eucalipto é uma árvore de crescimento rápido, plantada especificamente para extração de madeira.",
    characteristics: [
      "Cor: Castanho-rosado-claro",
      "Densidade: Média a alta",
      "Dureza: Dura",
      "Resistência: Alta",
      "Trabalhabilidade: Difícil",
    ],
    uses: [
      "Postes e estruturas",
      "Papel e celulose",
      "Tablados e decks",
      "Móveis pesados",
      "Construção naval",
      "Pisos",
    ],
    curiosities: [
      "Pode alcançar mais de 60 metros de altura",
      "Brota novamente após o corte",
      "Originário da Austrália e Tasmânia",
      "Altamente resistente a pragas e fungos",
      "Usado há séculos pelos aborígenes australianos",
    ],
    color: "#8B6F47",
  },
  {
    id: "lei",
    name: "Madeira de Lei",
    description:
      "Madeiras nobres e de alta qualidade, geralmente de crescimento lento e com grande resistência. São protegidas por leis ambientais em muitos países.",
    characteristics: [
      "Cor: Varia conforme espécie (escura a clara)",
      "Densidade: Alta",
      "Dureza: Muito dura",
      "Resistência: Muito alta",
      "Durabilidade: Excepcional",
    ],
    uses: [
      "Móveis de luxo",
      "Construção naval",
      "Portas e janelas",
      "Escadas",
      "Instrumentos musicais",
      "Objetos de arte",
    ],
    curiosities: [
      "Cresce lentamente, levando décadas para atingir tamanho comercial",
      "Altamente resistente a insetos, fungos e intempéries",
      "Algumas espécies podem durar séculos",
      "Ipê, Cumaru e Angelim são exemplos de madeiras de lei",
      "Exploração controlada por leis ambientais",
    ],
    color: "#654321",
  },
  {
    id: "osb",
    name: "OSB",
    description:
      "Oriented Strand Board (OSB) é um painel de madeira industrializado feito de camadas comprimidas de fibras de madeira unidas por adesivos sob calor e pressão.",
    characteristics: [
      "Cor: Marrom claro",
      "Densidade: Média",
      "Dureza: Média",
      "Resistência: Boa",
      "Uniformidade: Excelente",
    ],
    uses: [
      "Revestimento de telhados",
      "Revestimento de paredes",
      "Pisos e subpisos",
      "Móveis",
      "Armários",
      "Embalagens",
    ],
    curiosities: [
      "Utiliza 90% do tronco da madeira",
      "Feito a partir de madeira de reflorestamento",
      "Sem nudos, facilitando mecanização",
      "Excelente relação custo-benefício",
      "Resistente a ruptura e torsão",
      "Pode ser pregado, parafusado e grampeado",
    ],
    color: "#A0826D",
  },
];

export default function LibraryScreen() {
  const colors = useColors();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-primary">Biblioteca de Madeiras</Text>
          <Text className="text-sm text-muted">
            Conheça as características, usos e curiosidades sobre os principais tipos de madeira
          </Text>

          {/* Wood Cards */}
          {WOODS.map((wood) => (
            <TouchableOpacity
              key={wood.id}
              onPress={() => toggleExpand(wood.id)}
              activeOpacity={0.7}
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: colors.surface }}
            >
              {/* Header */}
              <View
                className="p-4 flex-row items-center justify-between"
                style={{ backgroundColor: wood.color }}
              >
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white">{wood.name}</Text>
                </View>
                <Text className="text-2xl text-white">{expandedId === wood.id ? "−" : "+"}</Text>
              </View>

              {/* Content */}
              {expandedId === wood.id && (
                <View className="p-4 gap-4">
                  {/* Description */}
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Descrição</Text>
                    <Text className="text-xs text-muted leading-relaxed">{wood.description}</Text>
                  </View>

                  {/* Characteristics */}
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Características</Text>
                    {wood.characteristics.map((char, idx) => (
                      <Text key={idx} className="text-xs text-muted mb-1">
                        • {char}
                      </Text>
                    ))}
                  </View>

                  {/* Uses */}
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Principais Usos</Text>
                    {wood.uses.map((use, idx) => (
                      <Text key={idx} className="text-xs text-muted mb-1">
                        • {use}
                      </Text>
                    ))}
                  </View>

                  {/* Curiosities */}
                  <View>
                    <Text className="text-sm font-semibold text-foreground mb-2">Curiosidades</Text>
                    {wood.curiosities.map((curiosity, idx) => (
                      <Text key={idx} className="text-xs text-muted mb-1">
                        💡 {curiosity}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Info Box */}
          <View
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-xs text-muted text-center">
              Toque em cada madeira para ver mais detalhes, características, usos e curiosidades.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
