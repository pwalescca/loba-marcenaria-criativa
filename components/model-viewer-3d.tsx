import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, PanResponder, Animated, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import { useColors } from "@/hooks/use-colors";

interface Model3DViewerProps {
  modelId: string;
  onClose: () => void;
}

export function Model3DViewer({ modelId, onClose }: Model3DViewerProps) {
  const colors = useColors();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // Atualizar rotação baseado no movimento
        setRotation((prev) => ({
          x: prev.x + gestureState.dy * 0.5,
          y: prev.y + gestureState.dx * 0.5,
        }));
      },
    })
  ).current;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleResetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  // HTML para visualizar modelo 3D do Sketchfab
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          margin: 0;
          padding: 0;
          background: #1a1a1a;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-family: Arial, sans-serif;
        }
        .container {
          width: 100%;
          height: 100%;
          position: relative;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        .info {
          position: absolute;
          bottom: 20px;
          left: 20px;
          color: #fff;
          background: rgba(0,0,0,0.7);
          padding: 15px;
          border-radius: 8px;
          font-size: 12px;
          z-index: 10;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <iframe 
          title="3D Model"
          frameborder="0" 
          allowfullscreen 
          mozallowfullscreen="true" 
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          execution-allowed="true" 
          sandbox="allow-same-origin allow-scripts allow-popups allow-presentation allow-forms"
          src="https://sketchfab.com/models/${modelId}/embed?autospin=0&autostart=0&preload=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0">
        </iframe>
        <div class="info">
          <p>💡 Use gestos para girar o modelo</p>
          <p>🔍 Use os botões para zoom</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between p-4 border-b"
        style={{ borderBottomColor: colors.border, backgroundColor: colors.surface }}
      >
        <Text className="text-lg font-bold text-foreground">Visualizador 3D</Text>
        <TouchableOpacity
          onPress={onClose}
          className="p-2 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold">✕</Text>
        </TouchableOpacity>
      </View>

      {/* WebView com modelo 3D */}
      <View className="flex-1" {...panResponder.panHandlers}>
        <WebView
          source={{ html: htmlContent }}
          style={{ flex: 1 }}
          scalesPageToFit={true}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          originWhitelist={["*"]}
        />
      </View>

      {/* Controles */}
      <View
        className="flex-row items-center justify-around p-4 border-t"
        style={{ borderTopColor: colors.border, backgroundColor: colors.surface }}
      >
        <TouchableOpacity
          onPress={handleZoomOut}
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-lg">−</Text>
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-sm text-muted">Zoom: {zoom.toFixed(1)}x</Text>
        </View>

        <TouchableOpacity
          onPress={handleZoomIn}
          className="p-3 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold text-lg">+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetView}
          className="px-4 py-3 rounded-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-semibold text-sm">Resetar</Text>
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View
        className="p-3"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-xs text-muted text-center">
          🖐️ Arraste para girar • 🔍 Use os botões para zoom • ↻ Clique em Resetar para voltar à posição inicial
        </Text>
      </View>
    </View>
  );
}
