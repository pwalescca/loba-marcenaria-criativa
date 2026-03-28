import { Stack } from "expo-router";

export default function CatalogLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Produtos",
        }}
      />
      <Stack.Screen 
        name="detail"
        options={{
          title: "Detalhes do Produto",
        }}
      />
    </Stack>
  );
}
