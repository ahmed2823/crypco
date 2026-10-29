import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import {
  BottomNav,
  colors,
  DemoNotice,
  formatAed,
  PropertyCard,
  ScreenTitle,
  SectionHeading,
} from "@/components/ui";

export default function PortfolioScreen() {
  const { properties, investments, investmentDataReady } = useAppContext();
  const investedTotal = investments.reduce((sum, item) => sum + item.amountAed, 0);
  const estimatedMonthly = investments.reduce((sum, item) => {
    const property = properties.find((candidate) => candidate.id === item.propertyId);
    return sum + (property ? (item.amountAed * property.annualYieldPercent) / 100 / 12 : 0);
  }, 0);
  const investedPropertyIds = [...new Set(investments.map((item) => item.propertyId))];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenTitle
          eyebrow="Your overview"
          title="Portfolio"
          subtitle="A local demo portfolio saved on this device."
        />
        <DemoNotice />
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>DEMO CONTRIBUTIONS</Text>
          <Text style={styles.totalValue}>{formatAed(investedTotal)}</Text>
          <Text style={styles.totalCaption}>No real funds have been collected.</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Positions</Text>
              <Text style={styles.statValue}>{investedPropertyIds.length}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Illustrative monthly rent</Text>
              <Text style={styles.statValue}>{formatAed(estimatedMonthly)}</Text>
            </View>
          </View>
        </View>

        <SectionHeading
          title="Your demo positions"
          action="Explore"
          onAction={() => router.replace("/")}
        />
        {!investmentDataReady ? (
          <Text style={styles.emptyText}>Loading saved demo data…</Text>
        ) : investedPropertyIds.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>⌂</Text>
            </View>
            <Text style={styles.emptyTitle}>Your first position starts here</Text>
            <Text style={styles.emptyText}>
              Explore sample listings and try a simulated investment. It will only update this demo portfolio.
            </Text>
            <Text onPress={() => router.replace("/")} style={styles.emptyLink}>
              Explore properties  →
            </Text>
          </View>
        ) : (
          investedPropertyIds.map((propertyId) => {
            const property = properties.find((item) => item.id === propertyId);
            const amount = investments
              .filter((item) => item.propertyId === propertyId)
              .reduce((sum, item) => sum + item.amountAed, 0);
            if (!property) return null;
            return (
              <View key={propertyId}>
                <View style={styles.positionHeader}>
                  <Text style={styles.positionAmount}>{formatAed(amount)} demo</Text>
                  <Text style={styles.positionBadge}>SIMULATED</Text>
                </View>
                <PropertyCard property={property} />
              </View>
            );
          })
        )}
        <Text style={styles.disclaimer}>
          Rental estimates are illustrative, not guaranteed, and exclude costs, vacancies, taxes, and market
          changes. This demo does not represent a real asset or ownership interest.
        </Text>
      </ScrollView>
      <BottomNav active="/portfolio" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", padding: 20, paddingBottom: 24 },
  totalCard: {
    backgroundColor: colors.ink,
    borderRadius: 22,
    padding: 20,
    marginVertical: 18,
  },
  totalLabel: { color: "#BCD3C4", fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  totalValue: { color: colors.white, fontSize: 30, fontWeight: "700", marginTop: 8 },
  totalCaption: { color: "#C9D0CB", fontSize: 11, marginTop: 4 },
  statsRow: {
    borderTopColor: "rgba(255,255,255,0.2)",
    borderTopWidth: 1,
    flexDirection: "row",
    marginTop: 20,
    paddingTop: 14,
  },
  stat: { flex: 1, gap: 5 },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 15 },
  statLabel: { color: "#C9D0CB", fontSize: 10 },
  statValue: { color: colors.white, fontSize: 14, fontWeight: "700" },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 22,
    alignItems: "center",
    marginTop: 4,
  },
  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.greenLight,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconText: { color: colors.green, fontSize: 24 },
  emptyTitle: { color: colors.ink, fontWeight: "700", fontSize: 16, marginTop: 14 },
  emptyText: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 8 },
  emptyLink: { color: colors.green, fontWeight: "700", fontSize: 12, marginTop: 14 },
  positionHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, marginBottom: 9 },
  positionAmount: { color: colors.ink, fontSize: 13, fontWeight: "700" },
  positionBadge: { color: colors.green, fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 8 },
});
