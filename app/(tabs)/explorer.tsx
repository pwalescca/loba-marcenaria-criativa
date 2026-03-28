import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, Linking } from "react-native";
import * as Location from "expo-location";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  price: number;
  distance: number;
  latitude: number;
  longitude: number;
}

// Mock data for suppliers in Goiânia, Goiás
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Paletes Goiás",
    address: "Rua 10, 123 - Setor Central",
    phone: "+55 62 98765-4321",
    price: 45.0,
    distance: 2.3,
    latitude: -15.7942,
    longitude: -48.0676,
  },
  {
    id: "2",
    name: "Madeira Forte Goiânia",
    address: "Av. Goiás, 456 - Setor Oeste",
    phone: "+55 62 91234-5678",
    price: 50.0,
    distance: 5.1,
    latitude: -15.7975,
    longitude: -48.0880,
  },
  {
    id: "3",
    name: "Paletes Premium GO",
    address: "Rua 4, 789 - Setor Leste",
    phone: "+55 62 99876-5432",
    price: 55.0,
    distance: 3.8,
    latitude: -15.7942,
    longitude: -48.0450,
  },
  {
    id: "4",
    name: "Fornecedor de Paletes Goiânia",
    address: "Av. T-9, 321 - Setor Bueno",
    phone: "+55 62 98888-1111",
    price: 48.0,
    distance: 4.2,
    latitude: -15.7850,
    longitude: -48.0750,
  },
  {
    id: "5",
    name: "Madeira & Paletes GO",
    address: "Rua 8, 654 - Setor Sul",
    phone: "+55 62 99999-2222",
    price: 52.0,
    distance: 6.5,
    latitude: -15.8100,
    longitude: -48.0600,
  },
];

export default function ExplorerScreen() {
  const colors = useColors();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10); // km

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      } else {
        Alert.alert("Permissão", "Permissão de localização negada");
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const handleSearchSuppliers = async () => {
    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Search for suppliers in Goiânia, Goiás
      const filteredSuppliers = MOCK_SUPPLIERS.filter((s) => s.distance <= searchRadius).sort(
        (a, b) => a.distance - b.distance,
      );

      setSuppliers(filteredSuppliers);

      if (filteredSuppliers.length === 0) {
        Alert.alert("Resultado", "Nenhum fornecedor encontrado neste raio em Goiânia");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar fornecedores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenMaps = (latitude: number, longitude: number) => {
    const url = `maps://0,0?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o mapa");
    });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-2xl font-bold text-primary">Buscar Fornecedores</Text>
            <Text className="text-sm text-muted mt-1">Goiânia, Goiás</Text>
          </View>

          {/* Search Section */}
          <View className="gap-4 p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <Text className="text-lg font-semibold text-foreground">Raio de Busca</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground font-semibold">{searchRadius} km</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setSearchRadius(Math.max(5, searchRadius - 5))}
                    className="px-3 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white font-bold">−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSearchRadius(searchRadius + 5)}
                    className="px-3 py-2 rounded-lg"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSearchSuppliers}
                disabled={isLoading}
                className="p-3 rounded-lg items-center"
                style={{ backgroundColor: colors.primary, opacity: isLoading ? 0.5 : 1 }}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <Text className="text-white font-semibold">Buscar Fornecedores</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Results */}
          {suppliers.length > 0 ? (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">
                {suppliers.length} Fornecedor{suppliers.length !== 1 ? "es" : ""} Encontrado{suppliers.length !== 1 ? "s" : ""}
              </Text>

              {suppliers.map((supplier) => (
                <View
                  key={supplier.id}
                  className="p-4 rounded-lg gap-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  {/* Supplier Info */}
                  <View>
                    <Text className="text-base font-bold text-foreground">{supplier.name}</Text>
                    <Text className="text-xs text-muted mt-1">{supplier.address}</Text>
                    <View className="flex-row items-center gap-2 mt-2">
                      <Text className="text-sm font-semibold text-primary">R$ {supplier.price.toFixed(2)}</Text>
                      <Text className="text-xs text-muted">• {supplier.distance.toFixed(1)} km</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleCall(supplier.phone)}
                      className="flex-1 p-2 rounded-lg items-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-semibold text-sm">📞 Ligar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleOpenMaps(supplier.latitude, supplier.longitude)}
                      className="flex-1 p-2 rounded-lg items-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-semibold text-sm">🗺️ Mapa</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Phone Display */}
                  <Text className="text-xs text-muted text-center">{supplier.phone}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12 gap-4">
              <Text className="text-4xl">🔍</Text>
              <Text className="text-lg font-semibold text-foreground">Nenhuma busca realizada</Text>
              <Text className="text-sm text-muted text-center">
                Clique em "Buscar Fornecedores" para encontrar paletes em Goiânia
              </Text>
            </View>
          )}

          {/* Info Box */}
          <View className="p-4 rounded-lg" style={{ backgroundColor: colors.surface }}>
            <Text className="text-sm font-semibold text-foreground mb-2">📍 Localização:</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Buscando fornecedores de paletes em Goiânia, Goiás. Ajuste o raio de busca para encontrar mais opções.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
