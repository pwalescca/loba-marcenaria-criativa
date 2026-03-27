import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface InventoryItem {
  id: string;
  name: string;
  photos: string[]; // Array of up to 4 photo URIs
  height: string;
  width: string;
  depth: string;
  woodType: string;
  quantity: number;
  createdAt: number;
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id" | "createdAt">) => Promise<void>;
  updateItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  isLoading: boolean;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY = "loba_inventory_items";

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from AsyncStorage on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading inventory items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Save items to AsyncStorage whenever they change
  const saveItems = async (updatedItems: InventoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
      setItems(updatedItems);
    } catch (error) {
      console.error("Error saving inventory items:", error);
      throw error;
    }
  };

  const addItem = async (item: Omit<InventoryItem, "id" | "createdAt">) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: Date.now(),
      photos: item.photos.slice(0, 4), // Limit to 4 photos
    };

    const updated = [...items, newItem];
    await saveItems(updated);
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const updated = items.map((i) =>
      i.id === id
        ? {
            ...i,
            ...updates,
            photos: updates.photos ? updates.photos.slice(0, 4) : i.photos,
          }
        : i,
    );
    await saveItems(updated);
  };

  const deleteItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    await saveItems(updated);
  };

  const getItem = (id: string) => {
    return items.find((i) => i.id === id);
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        deleteItem,
        getItem,
        isLoading,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
