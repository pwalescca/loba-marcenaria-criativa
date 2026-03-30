import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface WoodInfo {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  uses: string[];
  cuts: string[];
  curiosities: string[];
  color: string;
  image: any;
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
    cuts: [
      "Corte reto: Ideal para móveis e estruturas",
      "Corte em ângulo: Perfeito para detalhes decorativos",
      "Corte transversal: Facilita o acabamento",
      "Corte longitudinal: Excelente para peças longas",
      "Corte em bisel: Ótimo para acabamentos refinados",
    ],
    curiosities: [
      "O Pinheiro Bristlecone é uma das árvores mais antigas do mundo, com exemplares que ultrapassam 5.000 anos",
      "Cresce rapidamente sem necessidade de solo rico em nutrientes",
      "Impregnada com resina, ganha maior resistência",
      "Muito usada em marcenaria e carpintaria exterior",
    ],
    color: "#D4A574",
    image: require("@/assets/images/wood-pinus.jpg"),
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
    cuts: [
      "Corte reto: Para estruturas e postes",
      "Corte em ângulo: Requer ferramentas afiadas",
      "Corte transversal: Cuidado com lascas",
      "Corte em cunha: Para peças de encaixe",
      "Corte em meia-lua: Para acabamentos curvos",
    ],
    curiosities: [
      "Pode alcançar mais de 60 metros de altura",
      "Brota novamente após o corte",
      "Originário da Austrália e Tasmânia",
      "Altamente resistente a pragas e fungos",
      "Usado há séculos pelos aborígenes australianos",
    ],
    color: "#8B6F47",
    image: require("@/assets/images/wood-eucalipto.jpg"),
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
      "Resistência: Excelente",
      "Trabalhabilidade: Difícil",
    ],
    uses: [
      "Móveis de luxo",
      "Instrumentos musicais",
      "Acabamentos refinados",
      "Estruturas permanentes",
      "Arte e escultura",
      "Construção naval",
    ],
    cuts: [
      "Corte reto: Para móveis de alta qualidade",
      "Corte em ângulo: Requer precisão",
      "Corte transversal: Excelente acabamento",
      "Corte em espiral: Para peças artísticas",
      "Corte em mosaico: Para trabalhos decorativos",
    ],
    curiosities: [
      "Algumas espécies levam mais de 100 anos para crescer",
      "Extremamente resistente ao tempo e umidade",
      "Protegidas por leis ambientais internacionais",
      "Algumas espécies são mais caras que ouro",
      "Muito procuradas por colecionadores e artistas",
    ],
    color: "#3D2817",
    image: require("@/assets/images/wood-lei.jpg"),
  },
  {
    id: "osb",
    name: "OSB",
    description:
      "Oriented Strand Board (OSB) é um painel industrializado feito de fitas de madeira prensadas com resina. Oferece excelente relação custo-benefício.",
    characteristics: [
      "Cor: Marrom claro",
      "Densidade: Média",
      "Dureza: Média",
      "Resistência: Boa",
      "Trabalhabilidade: Excelente",
    ],
    uses: [
      "Estruturas de telhado",
      "Revestimento de paredes",
      "Pisos",
      "Embalagens",
      "Móveis econômicos",
      "Construção civil",
    ],
    cuts: [
      "Corte reto: Perfeito para estruturas",
      "Corte em ângulo: Fácil e preciso",
      "Corte transversal: Sem dificuldades",
      "Corte em L: Para encaixes estruturais",
      "Corte em U: Para passagens e aberturas",
    ],
    curiosities: [
      "Inventado na década de 1970 na Europa",
      "Feito a partir de resíduos de madeira",
      "Mais sustentável que compensado",
      "Excelente isolamento térmico",
      "Muito utilizado na construção civil moderna",
    ],
    color: "#A68B5B",
    image: require("@/assets/images/wood-osb.jpg"),
  },
];

export default function LibraryScreen() {
  const colors = useColors();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;

  const toggleExpand = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ScreenContainer className="p-0">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-8 gap-2">
          <Text className="text-4xl font-bold text-background">📚 Biblioteca</Text>
          <Text className="text-base text-background opacity-90">
            Conheça os tipos de madeira e suas características
          </Text>
        </View>

        {/* Wood Cards Grid */}
        <View className="px-4 py-6 gap-4">
          {WOODS.map((wood) => (
            <TouchableOpacity
              key={wood.id}
              onPress={() => toggleExpand(wood.id)}
              activeOpacity={0.7}
              className="rounded-2xl overflow-hidden border border-border"
              style={{ backgroundColor: colors.surface }}
            >
              {/* Card Header with Image and Name */}
              <View className="relative">
                <Image
                  source={wood.image}
                  style={{
                    width: "100%",
                    height: 180,
                    resizeMode: "cover",
                  }}
                />
                {/* Overlay with Wood Name */}
                <View
                  className="absolute inset-0 flex justify-end p-4"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <Text className="text-3xl font-bold text-yellow-400">
                    {wood.name}
                  </Text>
                </View>
              </View>

              {/* Card Content */}
              <View className="p-4 gap-3">
                {/* Description */}
                <Text className="text-sm text-muted leading-relaxed">
                  {wood.description}
                </Text>

                {/* Expanded Content */}
                {expandedId === wood.id && (
                  <View className="gap-4 mt-2 pt-4 border-t border-border">
                    {/* Characteristics */}
                    <View className="gap-2">
                      <Text className="text-base font-semibold text-foreground">
                        🔍 Características
                      </Text>
                      {wood.characteristics.map((char, idx) => (
                        <Text key={idx} className="text-sm text-muted ml-4">
                          • {char}
                        </Text>
                      ))}
                    </View>

                    {/* Uses */}
                    <View className="gap-2">
                      <Text className="text-base font-semibold text-foreground">
                        🛠️ Usos Principais
                      </Text>
                      {wood.uses.map((use, idx) => (
                        <Text key={idx} className="text-sm text-muted ml-4">
                          • {use}
                        </Text>
                      ))}
                    </View>

                    {/* Cuts */}
                    <View className="gap-2">
                      <Text className="text-base font-semibold text-foreground">
                        ✂️ Tipos de Corte
                      </Text>
                      {wood.cuts.map((cut, idx) => (
                        <Text key={idx} className="text-sm text-muted ml-4">
                          • {cut}
                        </Text>
                      ))}
                    </View>

                    {/* Curiosities */}
                    <View className="gap-2">
                      <Text className="text-base font-semibold text-foreground">
                        ⭐ Curiosidades
                      </Text>
                      {wood.curiosities.map((curiosity, idx) => (
                        <Text key={idx} className="text-sm text-muted ml-4">
                          • {curiosity}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Expand/Collapse Indicator */}
                <View className="flex-row justify-center pt-2">
                  <Text className="text-primary font-semibold">
                    {expandedId === wood.id ? "▼ Menos informações" : "▶ Mais informações"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Spacing */}
        <View className="h-8" />
      </ScrollView>
    </ScreenContainer>
  );
}
