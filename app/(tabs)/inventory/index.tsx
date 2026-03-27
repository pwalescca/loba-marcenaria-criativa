import React, { useCallback } from "react";
import { FlatList, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useInventory } from "@/lib/inventory-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function InventoryScreen() {
  const router = useRouter();
  const { items, deleteItem, isLoading } = useInventory();
  const colors = useColors();

  useFocusEffect(
    useCallback(() => {
      // Refresh when screen is focused
    }, []),
  );

  const handleAddItem = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/inventory/detail",
      params: { id: "new" },
    });
  };

  const handleEditItem = (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/inventory/detail",
      params: { id: itemId },
    });
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      "Deletar Peça",
      "Tem certeza que deseja deletar esta peça?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteItem(id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deletar a peça");
            }
          },
        },
      ],
    );
  };

  const renderItemCard = ({ item }: { item: typeof items[0] }) => (
    <TouchableOpacity
      onPress={() => handleEditItem(item.id)}
      activeOpacity={0.7}
      className="mb-4 rounded-lg overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Item Image */}
      {item.photos.length > 0 && (
        <Image
          source={{ uri: item.photos[0] }}
          className="w-full h-40"
          resizeMode="cover"
        />
      )}

      {/* Item Info */}
      <View className="p-4 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground flex-1">{item.name}</Text>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="font-bold text-sm" style={{ color: colors.background }}>
              {item.quantity}
            </Text>
          </View>
        </View>
        <Text className="text-sm text-muted">{item.woodType}</Text>
        <Text className="text-xs text-muted">
          Medidas: {item.height} × {item.width} × {item.depth}
        </Text>
        <Text className="text-xs text-muted">{item.photos.length} fotos</Text>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.id)}
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
          <Text className="text-2xl font-bold text-primary">Estoque</Text>
          <TouchableOpacity
            onPress={handleAddItem}
            activeOpacity={0.7}
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-2xl font-bold" style={{ color: colors.background }}>
              +
            </Text>
          </TouchableOpacity>
        </View>

        {/* Items List */}
        {items.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-lg text-muted">Nenhuma peça no estoque</Text>
            <TouchableOpacity
              onPress={handleAddItem}
              activeOpacity={0.7}
              className="px-6 py-3 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                Adicionar Primeira Peça
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItemCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
