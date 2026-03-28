import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Switch, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, you would save this preference to AsyncStorage
    // and update the theme provider
  };

  const handleAbout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Sobre o App",
      "Loba Marcenaria Criativa\n\nVersão: 1.0.0\nData de Criação: 27 de Março de 2026\nCriador: Manus AI\n\nApp desenvolvido para gerenciar catálogo de produtos, estoque e buscar fornecedores de paletes.",
      [{ text: "OK" }],
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-primary">Configurações</Text>

          {/* Theme Section */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">Aparência</Text>

            <View
              className="flex-row items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Modo Escuro</Text>
                <Text className="text-sm text-muted mt-1">Ativar tema escuro</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDarkMode ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">Sobre</Text>

            <TouchableOpacity
              onPress={handleAbout}
              activeOpacity={0.7}
              className="p-4 rounded-lg flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Informações do App</Text>
                <Text className="text-sm text-muted mt-1">Versão, data de criação e criador</Text>
              </View>
              <Text className="text-2xl text-primary">›</Text>
            </TouchableOpacity>
          </View>

          {/* App Info */}
          <View className="gap-3 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Versão do App</Text>
              <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
            </View>
            <View
              className="h-px"
              style={{ backgroundColor: colors.border }}
            />
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Data de Criação</Text>
              <Text className="text-sm font-semibold text-foreground">27/03/2026</Text>
            </View>
            <View
              className="h-px"
              style={{ backgroundColor: colors.border }}
            />
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted">Desenvolvido por</Text>
              <Text className="text-sm font-semibold text-foreground">Manus AI</Text>
            </View>
          </View>

          {/* Help Section */}
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">Ajuda</Text>

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Alert.alert(
                  "Como Usar",
                  "Produtos: Adicione e gerencie seus produtos com fotos e medidas.\n\nEstoque: Controle suas peças com informações de madeira e quantidade.\n\nExplorer: Busque fornecedores de paletes próximos com preços.",
                  [{ text: "OK" }],
                );
              }}
              activeOpacity={0.7}
              className="p-4 rounded-lg flex-row items-center justify-between"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Como Usar</Text>
                <Text className="text-sm text-muted mt-1">Guia de funcionalidades</Text>
              </View>
              <Text className="text-2xl text-primary">›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
