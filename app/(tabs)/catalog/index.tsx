import React, { useCallback } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useCatalog } from "@/lib/catalog-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function CatalogScreen() {
  const router = useRouter();
  const { products, deleteProduct, isLoading } = useCatalog();
  const colors = useColors();

  useFocusEffect(
    useCallback(() => {
      // Refresh when screen is focused
    }, []),
  );

  const handleAddProduct = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/catalog/detail",
      params: { id: "new" },
    });
  };

  const handleEditProduct = (productId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/catalog/detail",
      params: { id: productId },
    });
  };

  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      "Deletar Produto",
      "Tem certeza que deseja deletar este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar o produto");
            }
          },
        },
      ],
    );
  };

  const renderProductCard = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity
      onPress={() => handleEditProduct(item.id)}
      activeOpacity={0.7}
      className="mb-4 rounded-lg overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Product Image */}
      {item.photos.length > 0 && (
        <Image
          source={{ uri: item.photos[0] }}
          className="w-full h-40"
          resizeMode="cover"
        />
      )}

      {/* Product Info */}
      <View className="p-4 gap-2">
        <Text className="text-lg font-bold text-foreground">{item.name}</Text>
        <Text className="text-sm text-muted" numberOfLines={2}>
          {item.description}
        </Text>
        <Text className="text-xs text-muted">
          Medidas: {item.height} × {item.width} × {item.depth}
        </Text>
        <Text className="text-xs text-muted">{item.photos.length} fotos</Text>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => handleDeleteProduct(item.id)}
          activeOpacity={0.7}
          className="mt-2 py-2 rounded-lg items-center"
          style={{ backgroundColor: colors.error }}
        >
          <Text className="text-foreground font-semibold text-sm">Deletar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-primary">Seja bem vinda Paulla</Text>
            <Text className="text-sm text-muted mt-1">Vamos produzir?</Text>
          </View>
          <TouchableOpacity
            onPress={handleAddProduct}
            activeOpacity={0.7}
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-2xl font-bold" style={{ color: colors.background }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products List */}
        {products.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-lg text-muted">Nenhum produto no catálogo</Text>
            <TouchableOpacity
              onPress={handleAddProduct}
              activeOpacity={0.7}
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                Adicionar Primeiro Produto
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
