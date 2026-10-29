import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import {
  colors,
  DemoNotice,
  formatAed,
  ScreenTitle,
} from "@/components/ui";

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, favorites, toggleFavorite } = useAppContext();
  const [favoriteError, setFavoriteError] = useState("");
  const property = properties.find((item) => item.id === id);

  if (!property) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Property not found</Text>
          <Text style={styles.notFoundText}>This listing may no longer be available.</Text>
          <Text onPress={() => router.replace("/")} style={styles.backLink}>Back to explore</Text>
        </View>
      </SafeAreaView>
    );
  }

  const propertyId = property.id;
  const isFavorite = favorites.includes(propertyId);

  async function handleToggleFavorite() {
    try {
      await toggleFavorite(propertyId);
      setFavoriteError("");
    } catch (error) {
      console.error("Could not save property:", error);
      setFavoriteError("Could not update your saved properties. Please try again.");
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.topLabel}>PROPERTY OVERVIEW</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? "Remove from saved properties" : "Save property"}
            onPress={() => void handleToggleFavorite()}
            style={styles.saveButton}
          >
            <Text style={[styles.saveIcon, isFavorite && styles.savedIcon]}>{isFavorite ? "♥" : "♡"}</Text>
          </Pressable>
        </View>
        <Image source={{ uri: property.imageUrl }} style={styles.hero} />
        <View style={styles.titleRow}>
          <View style={styles.titleCopy}>
            <Text style={styles.location}>{property.location}</Text>
            <Text style={styles.name}>{property.name}</Text>
          </View>
          <View style={styles.estimateBadge}>
            <Text style={styles.estimateValue}>{property.annualYieldPercent.toFixed(1)}%</Text>
            <Text style={styles.estimateLabel}>est. annual</Text>
          </View>
        </View>
        <DemoNotice compact />
        {favoriteError ? <Text style={styles.favoriteError}>{favoriteError}</Text> : null}
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Sample property value</Text>
            <Text style={styles.statValue}>{formatAed(property.priceAed)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Minimum demo amount</Text>
            <Text style={styles.statValue}>{formatAed(property.minimumAed)}</Text>
          </View>
        </View>
        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Type</Text>
            <Text style={styles.statValue}>{property.kind}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Size</Text>
            <Text style={styles.statValue}>{property.areaSqFt} sq ft</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Bedrooms</Text>
            <Text style={styles.statValue}>{property.bedrooms || "Studio"}</Text>
          </View>
        </View>
        <ScreenTitle eyebrow="About this sample" title="A place to explore" subtitle={property.description} />
        <Text style={styles.sectionTitle}>Highlights</Text>
        <View style={styles.highlights}>
          {property.highlights.map((highlight) => (
            <View key={highlight} style={styles.highlightRow}>
              <Text style={styles.highlightDot}>•</Text>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.riskText}>
          Any yield shown is a fictional estimate for this product demo. Actual property income can vary,
          may be delayed or reduced, and is not guaranteed. This screen does not constitute an offer.
        </Text>
      </ScrollView>
      <View style={styles.bottomAction}>
        <View style={styles.actionCopy}>
          <Text style={styles.actionLabel}>Try a simulated flow</Text>
          <Text style={styles.actionAmount}>From {formatAed(property.minimumAed)}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: "/invest/[id]", params: { id: property.id } })}
          style={({ pressed }) => [styles.investButton, pressed && styles.pressed]}
        >
          <Text style={styles.investButtonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", paddingHorizontal: 20, paddingBottom: 22 },
  topRow: { flexDirection: "row", alignItems: "center", height: 45, marginBottom: 8 },
  backButton: { width: 35, height: 35, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  backButtonText: { color: colors.ink, fontSize: 27, lineHeight: 30, marginTop: -3 },
  topLabel: { flex: 1, textAlign: "center", color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  saveButton: { width: 35, height: 35, borderRadius: 18, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  saveIcon: { color: colors.ink, fontSize: 21, lineHeight: 24 },
  savedIcon: { color: colors.coral },
  favoriteError: { color: colors.coral, fontSize: 11, marginTop: 8 },
  hero: { width: "100%", height: 230, borderRadius: 20, backgroundColor: "#D8DDD5" },
  titleRow: { flexDirection: "row", alignItems: "center", marginVertical: 17, gap: 8 },
  titleCopy: { flex: 1 },
  location: { color: colors.muted, fontSize: 11 },
  name: { color: colors.ink, fontSize: 23, fontWeight: "700", marginTop: 4 },
  estimateBadge: { backgroundColor: colors.greenLight, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 8, alignItems: "center" },
  estimateValue: { color: colors.green, fontWeight: "800", fontSize: 15 },
  estimateLabel: { color: colors.green, fontSize: 9, marginTop: 2 },
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: "row",
    padding: 14,
    marginTop: 11,
    borderColor: colors.line,
    borderWidth: 1,
  },
  stat: { flex: 1, gap: 7 },
  statLabel: { color: colors.muted, fontSize: 9 },
  statValue: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  separator: { width: 1, backgroundColor: colors.line, marginHorizontal: 11 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: "700", marginTop: 3 },
  highlights: { backgroundColor: colors.white, padding: 15, borderRadius: 16, marginTop: 11 },
  highlightRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  highlightDot: { color: colors.green, fontSize: 16, lineHeight: 17 },
  highlightText: { color: colors.ink, fontSize: 12 },
  riskText: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 16 },
  bottomAction: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    backgroundColor: colors.white,
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 14,
  },
  actionCopy: { flex: 1, gap: 4 },
  actionLabel: { color: colors.muted, fontSize: 10 },
  actionAmount: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  investButton: { backgroundColor: colors.green, borderRadius: 13, paddingHorizontal: 27, paddingVertical: 14 },
  investButtonText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  pressed: { opacity: 0.8 },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  notFoundTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  notFoundText: { color: colors.muted, fontSize: 13, marginTop: 8 },
  backLink: { color: colors.green, fontSize: 13, fontWeight: "700", marginTop: 18 },
});
