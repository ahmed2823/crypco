import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import { BottomNav, colors, DemoNotice, PropertyCard, ScreenTitle } from "@/components/ui";

export default function SavedPropertiesScreen() {
  const { properties, favorites } = useAppContext();
  const savedProperties = properties.filter((property) => favorites.includes(property.id));

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text onPress={() => router.back()} style={styles.back}>‹  Back</Text>
        <ScreenTitle
          eyebrow="Your shortlist"
          title="Saved properties"
          subtitle="Keep track of sample listings you want to explore."
        />
        <DemoNotice />
        {savedProperties.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No saved listings yet</Text>
            <Text style={styles.emptyBody}>
              Open a sample property and tap the heart to add it to your shortlist.
            </Text>
            <Text onPress={() => router.replace("/")} style={styles.exploreLink}>Explore properties  →</Text>
          </View>
        ) : (
          savedProperties.map((property) => <PropertyCard key={property.id} property={property} />)
        )}
      </ScrollView>
      <BottomNav active="/" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", padding: 20, paddingBottom: 24 },
  back: { color: colors.muted, fontSize: 13, marginBottom: 17 },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderColor: colors.line,
    borderWidth: 1,
    padding: 19,
    marginTop: 18,
  },
  emptyTitle: { color: colors.ink, fontSize: 15, fontWeight: "700" },
  emptyBody: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  exploreLink: { color: colors.green, fontWeight: "700", fontSize: 12, marginTop: 14 },
});
