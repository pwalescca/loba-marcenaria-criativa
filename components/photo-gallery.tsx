import React, { useState } from "react";
import { View, Image, TouchableOpacity, ScrollView, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useColors } from "@/hooks/use-colors";

interface PhotoGalleryProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  editable?: boolean;
}

export function PhotoGallery({
  photos,
  onPhotosChange,
  maxPhotos = 4,
  editable = true,
}: PhotoGalleryProps) {
  const colors = useColors();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pickImage = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Limite de fotos", `Você pode adicionar no máximo ${maxPhotos} fotos.`);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = [...photos, result.assets[0].uri];
      onPhotosChange(newPhotos);
    }
  };

  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Limite de fotos", `Você pode adicionar no máximo ${maxPhotos} fotos.`);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = [...photos, result.assets[0].uri];
      onPhotosChange(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    if (selectedIndex >= newPhotos.length) {
      setSelectedIndex(Math.max(0, newPhotos.length - 1));
    }
  };

  if (photos.length === 0) {
    return (
      <View className="w-full gap-3">
        {editable && (
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.7}
              className="flex-1 py-4 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                Câmera
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.7}
              className="flex-1 py-4 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="font-semibold" style={{ color: colors.background }}>
                Galeria
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          className="w-full h-48 rounded-lg items-center justify-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Text style={{ color: colors.muted }}>Nenhuma foto adicionada</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="w-full gap-4">
      {/* Main Photo Display */}
      <View className="w-full h-64 rounded-lg overflow-hidden" style={{ backgroundColor: colors.surface }}>
        <Image
          source={{ uri: photos[selectedIndex] }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Photo Thumbnails */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
        {photos.map((photo, index) => (
          <View key={index} className="relative">
            <TouchableOpacity
              onPress={() => setSelectedIndex(index)}
              activeOpacity={0.7}
              className="w-20 h-20 rounded-lg overflow-hidden"
              style={{
                borderWidth: selectedIndex === index ? 3 : 0,
                borderColor: colors.primary,
              }}
            >
              <Image source={{ uri: photo }} className="w-full h-full" resizeMode="cover" />
            </TouchableOpacity>

            {/* Remove Button */}
            {editable && (
              <TouchableOpacity
                onPress={() => removePhoto(index)}
                activeOpacity={0.7}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.error }}
              >
                <Text className="text-white font-bold text-xs">×</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* Add Photo Button */}
        {editable && photos.length < maxPhotos && (
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.7}
              className="w-20 h-20 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary }}
            >
              <Text style={{ color: colors.primary, fontSize: 24 }}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.7}
              className="w-20 h-20 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary }}
            >
              <Text style={{ color: colors.primary, fontSize: 24 }}>🖼️</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Photo Counter */}
      <Text className="text-sm text-muted text-center">
        {photos.length} de {maxPhotos} fotos
      </Text>
    </View>
  );
}
