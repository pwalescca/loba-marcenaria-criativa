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

// Mock data for suppliers
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "1",
    name: "Paletes & Cia",
    address: "Rua das Flores, 123 - Centro",
    phone: "+55 11 98765-4321",
    price: 45.0,
    distance: 2.3,
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "2",
    name: "Madeira Forte",
    address: "Av. Paulista, 456 - Bela Vista",
    phone: "+55 11 91234-5678",
    price: 50.0,
    distance: 5.1,
    latitude: -23.5614,
    longitude: -46.6560,
  },
  {
    id: "3",
    name: "Paletes Premium",
    address: "Rua Augusta, 789 - Consolação",
    phone: "+55 11 99876-5432",
    price: 55.0,
    distance: 3.8,
    latitude: -23.5505,
    longitude: -46.6560,
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
    if (!hasPermission) {
      Alert.alert("Erro", "Permissão de localização é necessária");
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // In a real app, you would get the user's location and search for nearby suppliers
      // For now, we're using mock data
      const filteredSuppliers = MOCK_SUPPLIERS.filter((s) => s.distance <= searchRadius).sort(
        (a, b) => a.distance - b.distance,
      );

      setSuppliers(filteredSuppliers);

      if (filteredSuppliers.length === 0) {
        Alert.alert("Resultado", "Nenhum fornecedor encontrado neste raio");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível buscar fornecedores");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallSupplier = (phone: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${phone}`);
  };

  const handleOpenMap = (latitude: number, longitude: number, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = `maps://maps.apple.com/?q=${name}&ll=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="gap-6">
          {/* Header */}
          <Text className="text-2xl font-bold text-primary">Explorer</Text>

          {/* Search Radius */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">Raio de Busca</Text>
              <View
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="font-bold" style={{ color: colors.background }}>
                  {searchRadius} km
                </Text>
              </View>
            </View>

            {/* Radius Slider */}
            <View className="flex-row items-center gap-3">
              {[5, 10, 15, 20, 30].map((radius) => (
                <TouchableOpacity
                  key={radius}
                  onPress={() => setSearchRadius(radius)}
                  activeOpacity={0.7}
                  className="flex-1 py-2 rounded-lg items-center"
                  style={{
                    backgroundColor: searchRadius === radius ? colors.primary : colors.surface,
                  }}
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color:
                        searchRadius === radius ? colors.background : colors.foreground,
                    }}
                  >
                    {radius}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Search Button */}
          <TouchableOpacity
            onPress={handleSearchSuppliers}
            disabled={isLoading}
            activeOpacity={0.7}
            className="py-4 rounded-lg items-center justify-center"
            style={{ backgroundColor: colors.primary, opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text className="font-semibold" style={{ color: colors.background }}>
                Buscar Fornecedores
              </Text>
            )}
          </TouchableOpacity>

          {/* Suppliers List */}
          {suppliers.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-bold text-foreground">
                {suppliers.length} fornecedor(es) encontrado(s)
              </Text>

              {suppliers.map((supplier) => (
                <View
                  key={supplier.id}
                  className="rounded-lg p-4 gap-3"
                  style={{ backgroundColor: colors.surface }}
                >
                  {/* Supplier Name and Distance */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-foreground">{supplier.name}</Text>
                      <Text className="text-sm text-muted">{supplier.distance.toFixed(1)} km</Text>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="font-bold text-sm" style={{ color: colors.background }}>
                        R$ {supplier.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {/* Address */}
                  <Text className="text-sm text-muted">{supplier.address}</Text>

                  {/* Phone */}
                  <TouchableOpacity
                    onPress={() => handleCallSupplier(supplier.phone)}
                    activeOpacity={0.7}
                    className="py-2 rounded-lg items-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="font-semibold" style={{ color: colors.background }}>
                      📞 {supplier.phone}
                    </Text>
                  </TouchableOpacity>

                  {/* Map Button */}
                  <TouchableOpacity
                    onPress={() =>
                      handleOpenMap(supplier.latitude, supplier.longitude, supplier.name)
                    }
                    activeOpacity={0.7}
                    className="py-2 rounded-lg items-center"
                    style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary }}
                  >
                    <Text className="font-semibold text-primary">🗺️ Ver no Mapa</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Empty State */}
          {suppliers.length === 0 && !isLoading && (
            <View className="items-center justify-center gap-4 py-8">
              <Text className="text-lg text-muted text-center">
                Clique em "Buscar Fornecedores" para encontrar paletes na sua região
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
