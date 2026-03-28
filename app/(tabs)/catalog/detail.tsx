import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { PhotoGallery } from "@/components/photo-gallery";
import { useCatalog } from "@/lib/catalog-context";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function CatalogDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addProduct, updateProduct, getProduct } = useCatalog();
  const colors = useColors();

  const isNewProduct = id === "new";
  const existingProduct = !isNewProduct ? getProduct(id as string) : null;

  const [name, setName] = useState(existingProduct?.name || "");
  const [description, setDescription] = useState(existingProduct?.description || "");
  const [height, setHeight] = useState(existingProduct?.height || "");
  const [width, setWidth] = useState(existingProduct?.width || "");
  const [depth, setDepth] = useState(existingProduct?.depth || "");
  const [photos, setPhotos] = useState<string[]>(existingProduct?.photos || []);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome do produto é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        name: name.trim(),
        description: description.trim(),
        height: height.trim(),
        width: width.trim(),
        depth: depth.trim(),
        photos,
      };

      if (isNewProduct) {
        await addProduct(productData);
      } else {
        await updateProduct(id as string, productData);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o produto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-primary">
              {isNewProduct ? "Novo Produto" : "Editar Produto"}
            </Text>
          </View>

          {/* Photo Gallery */}
          <PhotoGallery photos={photos} onPhotosChange={setPhotos} />

          {/* Product Name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Nome do Produto *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex: Estante de Palete"
              placeholderTextColor={colors.muted}
              className="px-4 py-3 rounded-lg text-foreground"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
          </View>

          {/* Description */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descreva o produto..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={4}
              className="px-4 py-3 rounded-lg text-foreground"
              style={{ backgroundColor: colors.surface, color: colors.foreground }}
            />
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
