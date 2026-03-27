import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, type GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const router = useRouter();
  const { authenticate, isLoading, isBiometricAvailable } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const colors = useColors();

  useEffect(() => {
    // Auto-authenticate if biometric is available
    if (isBiometricAvailable && !isLoading) {
      handleBiometricAuth();
    }
  }, [isBiometricAvailable, isLoading]);

  const handleBiometricAuth = async () => {
    setIsAuthenticating(true);
    setErrorMessage("");

    try {
      const success = await authenticate();
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace("/(tabs)");
      } else {
        setErrorMessage("Autenticação falhou. Tente novamente.");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      setErrorMessage("Erro ao autenticar. Tente novamente.");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background" className="justify-center px-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="items-center gap-8">
          {/* Logo / Header */}
          <View className="items-center gap-4">
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-4xl font-bold" style={{ color: colors.background }}>
                LM
              </Text>
            </View>
            <Text className="text-3xl font-bold text-foreground text-center">
              Loba Marcenaria Criativa
            </Text>
            <Text className="text-base text-muted text-center">
              Gerenciador de Negócios
            </Text>
          </View>

          {/* Error Message */}
          {errorMessage && (
            <View
              className="w-full p-4 rounded-lg"
              style={{ backgroundColor: colors.error }}
            >
              <Text className="text-foreground text-center font-semibold">
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Authentication Button */}
          <TouchableOpacity
            onPress={handleBiometricAuth}
            disabled={isAuthenticating}
            activeOpacity={0.8}
            className="w-full py-4 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            {isAuthenticating ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.background }}
              >
                {isBiometricAvailable ? "Autenticar com Face ID" : "Autenticar"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-sm text-muted text-center">
              {isBiometricAvailable
                ? "Use Face ID para acessar sua conta"
                : "Biometria não disponível"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
