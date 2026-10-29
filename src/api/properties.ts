import type { Property } from "@/types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export const isDemoMode = !API_BASE_URL;

function isProperty(value: unknown): value is Property {
  if (!value || typeof value !== "object") return false;
  const property = value as Record<string, unknown>;
  return (
    typeof property.id === "string" &&
    typeof property.name === "string" &&
    typeof property.location === "string" &&
    typeof property.kind === "string" &&
    typeof property.priceAed === "number" &&
    Number.isFinite(property.priceAed) &&
    typeof property.minimumAed === "number" &&
    Number.isFinite(property.minimumAed) &&
    typeof property.annualYieldPercent === "number" &&
    Number.isFinite(property.annualYieldPercent) &&
    typeof property.fundedPercent === "number" &&
    Number.isFinite(property.fundedPercent) &&
    typeof property.status === "string" &&
    typeof property.bedrooms === "number" &&
    typeof property.bathrooms === "number" &&
    typeof property.areaSqFt === "number" &&
    typeof property.imageUrl === "string" &&
    typeof property.description === "string" &&
    Array.isArray(property.highlights) &&
    property.highlights.every((item) => typeof item === "string")
  );
}

export async function fetchProperties(): Promise<Property[] | null> {
  if (!API_BASE_URL) return null;

  const response = await fetch(`${API_BASE_URL}/api/properties`);
  if (!response.ok) {
    throw new Error(`Property service returned ${response.status}`);
  }

  const result: unknown = await response.json();
  if (!Array.isArray(result) || !result.every(isProperty)) {
    throw new Error("Property service returned an invalid catalog.");
  }
  return result;
}
