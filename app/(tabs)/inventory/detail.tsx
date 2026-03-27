import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { PhotoGallery } from "@/components/photo-gallery";
import { useInventory } from "@/lib/inventory-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

const WOOD_TYPES = [
  "Pinho",
  "Eucalipto",
  "Cedro",
  "Ipê",
  "Jatobá",
  "Peroba",
  "Angelim",
  "Cumaru",
  "Outro",
];

export default function InventoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addItem, updateItem, getItem } = useInventory();
  const colors = useColors();

  const isNewItem = id === "new";
  const existingItem = !isNewItem ? getItem(id as string) : null;

  const [name, setName] = useState(existingItem?.name || "");
  const [woodType, setWoodType] = useState(existingItem?.woodType || "");
  const [height, setHeight] = useState(existingItem?.height || "");
  const [width, setWidth] = useState(existingItem?.width || "");
  const [depth, setDepth] = useState(existingItem?.depth || "");
  const [quantity, setQuantity] = useState(existingItem?.quantity.toString() || "0");
  const [photos, setPhotos] = useState<string[]>(existingItem?.photos || []);
  const [isSaving, setIsSaving] = useState(false);
  const [showWoodTypePicker, setShowWoodTypePicker] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome da peça é obrigatório");
      return;
    }

    if (!woodType) {
      Alert.alert("Erro", "Tipo de madeira é obrigatório");
      return;
    }

    if (photos.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos uma foto");
      return;
    }

    setIsSaving(true);
    try {
      const itemData = {
        name: name.trim(),
        woodType,
        height: height.trim(),
        width: width.trim(),
        depth: depth.trim(),
        quantity: parseInt(quantity) || 0,
        photos,
      };

      if (isNewItem) {
        await addItem(itemData);
      } else {
        await updateItem(id as string, itemData);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a peça");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const incrementQuantity = () => {
    setQuantity((parseInt(quantity) || 0 + 1).toString());
  };

  const decrementQuantity = () => {
    const newQty = Math.max(0, (parseInt(quantity) || 0) - 1);
    setQuantity(newQty.toString());
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-primary">
              {isNewItem ? "Nova Peça" : "Editar Peça"}
            </Text>
          </View>

          {/* Photo Gallery */}
          <PhotoGallery photos={photos} onPhotosChange={setPhotos} />

          {/* Item Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome da Peça *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Estante de Palete"
              placeholderTextColor={colors.muted}
              className="px-4 py-3 rounded-lg text-foreground"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Wood Type */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Tipo de Madeira *</Text>
            <TouchableOpacity
              onPress={() => setShowWoodTypePicker(!showWoodTypePicker)}
              activeOpacity={0.7}
              className="px-4 py-3 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text style={{ color: woodType ? colors.foreground : colors.muted }}>
                {woodType || "Selecione o tipo de madeira"}
              </Text>
            </TouchableOpacity>

            {/* Wood Type Picker */}
            {showWoodTypePicker && (
              <View className="gap-2 mt-2">
                {WOOD_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => {
                      setWoodType(type);
                      setShowWoodTypePicker(false);
                    }}
                    activeOpacity={0.7}
                    className="px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: woodType === type ? colors.primary : colors.surface,
                    }}
                  >
                    <Text
                      style={{
                        color: woodType === type ? colors.background : colors.foreground,
                      }}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Dimensions */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Medidas (em cm)</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Altura</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="px-3 py-2 rounded-lg text-foreground"
                  style={{ backgroundColor: colors.surface, color: colors.foreground }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Largura</Text>
                <TextInput
                  value={width}
                  onChangeText={setWidth}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="px-3 py-2 rounded-lg text-foreground"
                  style={{ backgroundColor: colors.surface, color: colors.foreground }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Profundidade</Text>
                <TextInput
                  value={depth}
                  onChangeText={setDepth}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="decimal-pad"
                  className="px-3 py-2 rounded-lg text-foreground"
                  style={{ backgroundColor: colors.surface, color: colors.foreground }}
                />
              </View>
            </View>
          </View>

          {/* Quantity */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Quantidade em Estoque</Text>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={decrementQuantity}
                activeOpacity={0.7}
                className="w-12 h-12 rounded-lg items-center justify-center"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-2xl font-bold text-primary">−</Text>
              </TouchableOpacity>
              <View className="flex-1">
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  className="px-4 py-3 rounded-lg text-center font-bold text-foreground"
                  style={{ backgroundColor: colors.surface, color: colors.foreground }}
                />
              </View>
              <TouchableOpacity
                onPress={incrementQuantity}
                activeOpacity={0.7}
                className="w-12 h-12 rounded-lg items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-2xl font-bold" style={{ color: colors.background }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.7}
              className="flex-1 py-4 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="font-semibold text-foreground">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.7}
              className="flex-1 py-4 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary, opacity: isSaving ? 0.6 : 1 }}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
