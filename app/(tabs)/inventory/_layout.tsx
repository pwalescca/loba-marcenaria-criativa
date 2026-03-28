import { Stack } from "expo-router";

export default function InventoryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: "Estoque",
        }}
      />
      <Stack.Screen 
        name="detail"
        options={{
          title: "Detalhes da Peça",
        }}
      />
    </Stack>
  );
}
