import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  description: string;
  photos: string[]; // Array of up to 4 photo URIs
  height: string;
  width: string;
  depth: string;
  createdAt: number;
}

interface CatalogContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  isLoading: boolean;
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

const STORAGE_KEY = "loba_catalog_products";

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from AsyncStorage on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProducts(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save products to AsyncStorage whenever they change
  const saveProducts = async (updatedProducts: Product[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error saving products:", error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: Date.now(),
      photos: product.photos.slice(0, 4), // Limit to 4 photos
    };

    const updated = [...products, newProduct];
    await saveProducts(updated);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            ...updates,
            photos: updates.photos ? updates.photos.slice(0, 4) : p.photos,
          }
        : p,
    );
    await saveProducts(updated);
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    await saveProducts(updated);
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        isLoading,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
