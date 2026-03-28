import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";

export function Watermark() {
  const colors = useColors();

  return (
    <View
      style={[
        styles.watermarkContainer,
        { backgroundColor: colors.background },
      ]}
      pointerEvents="none"
    >
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.watermarkImage}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  watermarkContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 200,
    height: 200,
    opacity: 0.08,
    justifyContent: "center",
    alignItems: "center",
  },
  watermarkImage: {
    width: "100%",
    height: "100%",
  },
});
