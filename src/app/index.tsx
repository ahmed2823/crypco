import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import {
  BottomNav,
  colors,
  DemoNotice,
  PropertyCard,
  ScreenTitle,
  SectionHeading,
} from "@/components/ui";

export default function ExploreScreen() {
  const { properties, favorites, catalogError, catalogLoading, refreshProperties, isDemoMode } =
    useAppContext();
  const featured = useMemo(() => properties.slice(0, 3), [properties]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>C</Text>
          </View>
          <Text style={styles.brandName}>COVE</Text>
          <View style={styles.brandSpacer} />
          <Pressable onPress={() => router.push("/saved")} style={styles.savedButton}>
            <Text style={styles.savedButtonText}>Saved {favorites.length ? `· ${favorites.length}` : ""}</Text>
          </Pressable>
          <View style={styles.currencyPill}>
            <Text style={styles.currencyText}>UAE · AED</Text>
          </View>
        </View>

        <ScreenTitle
          eyebrow="Real estate, made approachable"
          title={"Own a little\nof somewhere."}
          subtitle="Explore sample Dubai property opportunities and learn how fractional ownership works."
        />
        {isDemoMode ? <DemoNotice /> : null}
        {catalogError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Property listings are unavailable</Text>
            <Text style={styles.errorText}>{catalogError}</Text>
            <Text onPress={() => void refreshProperties()} style={styles.retryText}>
              Try again
            </Text>
          </View>
        ) : null}

        <View style={styles.introCard}>
          <View style={styles.introCopy}>
            <Text style={styles.introLabel}>START EXPLORING</Text>
            <Text style={styles.introTitle}>A portfolio can start small.</Text>
            <Text style={styles.introBody}>
              Learn about shared property ownership with illustrative listings and a simulated portfolio.
            </Text>
            <Text
              onPress={() => router.push("/portfolio")}
              accessibilityRole="button"
              style={styles.introLink}
            >
              See how it works  →
            </Text>
          </View>
          <View style={styles.introOrb}>
            <Text style={styles.introOrbText}>AED{"\n"}500</Text>
          </View>
        </View>

        <SectionHeading
          title="Properties to explore"
          action="View portfolio"
          onAction={() => router.push("/portfolio")}
        />
        {catalogLoading && properties.length === 0 ? (
          <Text style={styles.loadingText}>Loading property catalog…</Text>
        ) : null}
        {!catalogLoading && !catalogError && featured.length === 0 ? (
          <Text style={styles.loadingText}>No properties are available right now.</Text>
        ) : null}
        {featured.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
        <Text style={styles.disclaimer}>
          Estimates and sample property data are for product demonstration only. Property investments
          involve risk, may be illiquid, and can result in loss of capital.
        </Text>
      </ScrollView>
      <BottomNav active="/" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 22 },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  brandMark: {
    height: 31,
    width: 31,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  brandMarkText: { color: "white", fontSize: 17, fontWeight: "800" },
  brandName: { color: colors.ink, fontSize: 12, fontWeight: "800", letterSpacing: 2 },
  brandSpacer: { flex: 1 },
  savedButton: { paddingHorizontal: 10, paddingVertical: 8, marginRight: 7 },
  savedButtonText: { color: colors.green, fontSize: 11, fontWeight: "700" },
  currencyPill: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: colors.white,
  },
  currencyText: { color: colors.ink, fontSize: 10, fontWeight: "700" },
  introCard: {
    backgroundColor: colors.ink,
    minHeight: 178,
    borderRadius: 22,
    marginVertical: 20,
    padding: 18,
    overflow: "hidden",
    flexDirection: "row",
  },
  introCopy: { flex: 1, paddingRight: 8, justifyContent: "center" },
  introLabel: { color: colors.amber, fontSize: 9, fontWeight: "800", letterSpacing: 1.4 },
  introTitle: { color: colors.white, fontSize: 20, fontWeight: "700", marginTop: 7 },
  introBody: { color: "#CFD7D1", fontSize: 11, lineHeight: 16, marginTop: 7, maxWidth: 240 },
  introLink: { color: "#BFE2C9", fontSize: 11, fontWeight: "700", marginTop: 11 },
  introOrb: {
    width: 74,
    height: 74,
    borderRadius: 38,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#315B47",
  },
  introOrbText: { color: colors.white, fontSize: 13, lineHeight: 17, textAlign: "center", fontWeight: "800" },
  errorCard: {
    backgroundColor: "#FBEAE7",
    borderColor: "#EED0CB",
    borderWidth: 1,
    borderRadius: 14,
    padding: 13,
    marginTop: 12,
  },
  errorTitle: { color: colors.coral, fontWeight: "700", fontSize: 13 },
  errorText: { color: colors.ink, fontSize: 11, marginTop: 5 },
  retryText: { color: colors.green, fontWeight: "700", marginTop: 8 },
  loadingText: { color: colors.muted, fontSize: 13, marginBottom: 20 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 7 },
});
