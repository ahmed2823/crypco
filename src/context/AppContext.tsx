import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SAMPLE_PROPERTIES } from "@/data/properties";
import { fetchProperties, isDemoMode } from "@/api/properties";
import type { DemoInvestment, Property } from "@/types";

const STORAGE_KEY = "@cove/demo-investments-v1";

function isDemoInvestment(value: unknown): value is DemoInvestment {
  if (!value || typeof value !== "object") return false;
  const investment = value as Record<string, unknown>;
  return (
    typeof investment.id === "string" &&
    typeof investment.propertyId === "string" &&
    typeof investment.amountAed === "number" &&
    Number.isFinite(investment.amountAed) &&
    typeof investment.createdAt === "string" &&
    investment.status === "demo"
  );
}

type AppContextValue = {
  properties: Property[];
  investments: DemoInvestment[];
  favorites: string[];
  isDemoMode: boolean;
  catalogLoading: boolean;
  catalogError: string | null;
  investmentDataReady: boolean;
  refreshProperties: () => Promise<void>;
  addDemoInvestment: (propertyId: string, amountAed: number) => Promise<void>;
  toggleFavorite: (propertyId: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: React.PropsWithChildren) {
  const [properties, setProperties] = useState<Property[]>(isDemoMode ? SAMPLE_PROPERTIES : []);
  const [investments, setInvestments] = useState<DemoInvestment[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [investmentDataReady, setInvestmentDataReady] = useState(false);

  useEffect(() => {
    let active = true;
    fetchProperties()
      .then((catalog) => {
        if (active) setProperties(catalog ?? SAMPLE_PROPERTIES);
      })
      .catch((error: unknown) => {
        console.error("Could not load property catalog:", error);
        if (active) {
          setCatalogError(error instanceof Error ? error.message : "Could not load properties.");
          setProperties([]);
        }
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshProperties = useCallback(async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const catalog = await fetchProperties();
      setProperties(catalog ?? SAMPLE_PROPERTIES);
    } catch (error) {
      console.error("Could not load property catalog:", error);
      setCatalogError(error instanceof Error ? error.message : "Could not load properties.");
      setProperties([]);
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && active) {
          const parsed: unknown = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.every(isDemoInvestment)) {
            setInvestments(parsed);
          } else if (
            parsed &&
            typeof parsed === "object" &&
            "investments" in parsed &&
            "favorites" in parsed &&
            Array.isArray(parsed.investments) &&
            parsed.investments.every(isDemoInvestment) &&
            Array.isArray(parsed.favorites) &&
            parsed.favorites.every((favorite) => typeof favorite === "string")
          ) {
            setInvestments(parsed.investments);
            setFavorites(parsed.favorites);
          } else {
            throw new Error("Saved demo portfolio has an invalid format.");
          }
        }
      })
      .catch((error: unknown) => {
        console.error("Could not restore demo portfolio:", error);
      })
      .finally(() => {
        if (active) setInvestmentDataReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!investmentDataReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ investments, favorites })).catch(
      (error: unknown) => {
        console.error("Could not save demo data:", error);
      },
    );
  }, [investmentDataReady, investments, favorites]);

  const addDemoInvestment = useCallback(async (propertyId: string, amountAed: number) => {
    const investment: DemoInvestment = {
      id: `${Date.now()}`,
      propertyId,
      amountAed,
      createdAt: new Date().toISOString(),
      status: "demo",
    };
    const nextInvestments = [investment, ...investments];
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ investments: nextInvestments, favorites }),
    );
    setInvestments(nextInvestments);
  }, [favorites, investments]);

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      const nextFavorites = favorites.includes(propertyId)
        ? favorites.filter((favorite) => favorite !== propertyId)
        : [...favorites, propertyId];
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ investments, favorites: nextFavorites }),
      );
      setFavorites(nextFavorites);
    },
    [favorites, investments],
  );

  const resetDemoData = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setInvestments([]);
    setFavorites([]);
  }, []);

  const value = useMemo(
    () => ({
      properties,
      investments,
      favorites,
      isDemoMode,
      catalogLoading,
      catalogError,
      investmentDataReady,
      refreshProperties,
      addDemoInvestment,
      toggleFavorite,
      resetDemoData,
    }),
    [
      properties,
      investments,
      favorites,
      catalogLoading,
      catalogError,
      investmentDataReady,
      refreshProperties,
      addDemoInvestment,
      toggleFavorite,
      resetDemoData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppContext must be used within AppProvider.");
  return value;
}
