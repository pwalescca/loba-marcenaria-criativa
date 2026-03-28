import React, { useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useProjects } from "@/lib/projects-context";
import { Model3DViewer } from "@/components/model-viewer-3d";
import * as Haptics from "expo-haptics";

export default function ProjectsScreen() {
  const colors = useColors();
  const { projects, addProject, deleteProject, toggleFavorite } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sketchfabUrl, setSketchfabUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const extractModelId = (url: string): string => {
    const match = url.match(/\/models\/([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  const handleAddProject = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome do projeto é obrigatório");
      return;
    }

    if (!sketchfabUrl.trim()) {
      Alert.alert("Erro", "URL do Sketchfab é obrigatória");
      return;
    }

    const modelId = extractModelId(sketchfabUrl);
    if (!modelId) {
      Alert.alert("Erro", "URL do Sketchfab inválida. Use: https://sketchfab.com/models/MODEL_ID");
      return;
    }

    setIsSaving(true);
    try {
      await addProject({
        name: name.trim(),
        description: description.trim(),
        sketchfabUrl,
        modelId,
        isFavorite: false,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setName("");
      setDescription("");
      setSketchfabUrl("");
      setShowForm(false);
      Alert.alert("Sucesso", "Projeto adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar o projeto");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "Deseja remover este projeto?", [
      { text: "Cancelar" },
      {
        text: "Remover",
        onPress: async () => {
          await deleteProject(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const openViewer = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  if (selectedModelId) {
    return (
      <Model3DViewer
        modelId={selectedModelId}
        onClose={() => setSelectedModelId(null)}
      />
    );
  }

  const favorites = projects.filter((p) => p.isFavorite);
  const others = projects.filter((p) => !p.isFavorite);

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-primary">Projetos 3D</Text>
            <TouchableOpacity
              onPress={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-semibold">{showForm ? "Cancelar" : "Novo"}</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {showForm && (
            <View className="gap-4 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <Text className="text-lg font-bold text-foreground">Adicionar Projeto</Text>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Nome do Projeto</Text>
                <TextInput
                  placeholder="Ex: Móvel Sala de Estar"
                  value={name}
                  onChangeText={setName}
                  className="border rounded-lg p-3"
                  style={{ borderColor: colors.border, color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">Descrição</Text>
                <TextInput
                  placeholder="Descreva seu projeto..."
                  value={description}
                  onChangeText={setDescription}
                  className="border rounded-lg p-3"
                  style={{ borderColor: colors.border, color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View>
                <Text className="text-sm font-semibold text-foreground mb-2">URL do Sketchfab</Text>
                <TextInput
                  placeholder="https://sketchfab.com/models/MODEL_ID"
                  value={sketchfabUrl}
                  onChangeText={setSketchfabUrl}
                  className="border rounded-lg p-3"
                  style={{ borderColor: colors.border, color: colors.foreground }}
                  placeholderTextColor={colors.muted}
                />
                <Text className="text-xs text-muted mt-2">
                  Cole o link do modelo 3D do Sketchfab aqui
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleAddProject}
                disabled={isSaving}
                className="p-3 rounded-lg"
                style={{ backgroundColor: colors.primary, opacity: isSaving ? 0.5 : 1 }}
              >
                <Text className="text-white font-semibold text-center">
                  {isSaving ? "Salvando..." : "Adicionar Projeto"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-primary">⭐ Favoritos</Text>
              {favorites.map((project) => (
                <View
                  key={project.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{project.name}</Text>
                      {project.description && (
                        <Text className="text-sm text-muted mt-1">{project.description}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(project.id)}
                      className="ml-2"
                    >
                      <Text className="text-xl">⭐</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => openViewer(project.modelId)}
                      className="flex-1 p-2 rounded-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-semibold text-center text-sm">
                        Ver Modelo 3D
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(project.id)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.error }}
                    >
                      <Text className="text-white font-semibold">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Other Projects */}
          {others.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">Meus Projetos</Text>
              {others.map((project) => (
                <View
                  key={project.id}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surface }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-bold text-foreground">{project.name}</Text>
                      {project.description && (
                        <Text className="text-sm text-muted mt-1">{project.description}</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(project.id)}
                      className="ml-2"
                    >
                      <Text className="text-xl">☆</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => openViewer(project.modelId)}
                      className="flex-1 p-2 rounded-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-semibold text-center text-sm">
                        Ver Modelo 3D
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(project.id)}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: colors.error }}
                    >
                      <Text className="text-white font-semibold">🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {projects.length === 0 && !showForm && (
            <View className="items-center justify-center py-12 gap-4">
              <Text className="text-4xl">📐</Text>
              <Text className="text-lg font-semibold text-foreground">Nenhum Projeto</Text>
              <Text className="text-sm text-muted text-center">
                Adicione modelos 3D do Sketchfab para visualizar seus projetos
              </Text>
            </View>
          )}

          {/* Info Box */}
          <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-foreground mb-2">Como Usar:</Text>
            <Text className="text-xs text-muted leading-relaxed">
              1. Encontre um modelo 3D no Sketchfab{"\n"}
              2. Copie a URL do modelo{"\n"}
              3. Cole aqui e clique em "Adicionar Projeto"{"\n"}
              4. Clique em "Ver Modelo 3D" para visualizar com rotação e zoom
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
