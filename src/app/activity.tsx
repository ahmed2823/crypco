import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import { BottomNav, colors, DemoNotice, formatAed, ScreenTitle } from "@/components/ui";

export default function ActivityScreen() {
  const { investments, properties } = useAppContext();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Recent updates"
          title="Activity"
          subtitle="A record of actions in this demo on this device."
        />
        <DemoNotice />
        {investments.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyBody}>
              When you try the simulated investment flow, its demo entry will appear here.
            </Text>
          </View>
        ) : (
          investments.map((investment) => {
            const property = properties.find((item) => item.id === investment.propertyId);
            return (
              <View key={investment.id} style={styles.activityRow}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>↗</Text>
                </View>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>Demo investment request</Text>
                  <Text style={styles.activitySubtitle}>{property?.name ?? "Sample property"}</Text>
                  <Text style={styles.activityDate}>
                    {new Date(investment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.activityAmount}>{formatAed(investment.amountAed)}</Text>
              </View>
            );
          })
        )}
        <Text style={styles.notice}>
          These entries are stored locally for demonstration and are not orders, confirmations, or financial
          transactions.
        </Text>
      </ScrollView>
      <BottomNav active="/activity" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", padding: 20, paddingBottom: 24 },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 19,
    marginTop: 18,
    borderColor: colors.line,
    borderWidth: 1,
  },
  emptyTitle: { color: colors.ink, fontWeight: "700", fontSize: 15 },
  emptyBody: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 7 },
  activityRow: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.line,
    borderWidth: 1,
  },
  activityIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  activityIconText: { color: colors.green, fontSize: 19, fontWeight: "700" },
  activityCopy: { flex: 1 },
  activityTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  activitySubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  activityDate: { color: "#929A94", fontSize: 10, marginTop: 5 },
  activityAmount: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  notice: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 17 },
});
