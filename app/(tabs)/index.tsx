import { View, Text } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <View className="flex-1 items-center justify-center gap-4">
        {/* Welcome Message */}
        <Text className="text-4xl font-bold text-primary text-center">
          Seja bem vinda Paulla
        </Text>
        <Text className="text-2xl font-semibold text-foreground text-center">
          Vamos produzir?
        </Text>
      </View>
    </ScreenContainer>
  );
}
