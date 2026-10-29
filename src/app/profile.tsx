import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import { BottomNav, colors, DemoNotice, ScreenTitle } from "@/components/ui";

const menuItems = [
  { title: "Identity verification", detail: "Not available in demo mode" },
  { title: "Payment methods", detail: "No payment provider is connected" },
  { title: "Help & support", detail: "Connect a support channel before launch" },
  { title: "Legal and risk disclosures", detail: "Add approved jurisdiction-specific documents" },
];

export default function ProfileScreen() {
  const { resetDemoData } = useAppContext();
  const [resetPending, setResetPending] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function handleReset() {
    if (!resetPending) {
      setResetPending(true);
      setResetMessage("Tap again to clear local demo portfolio and activity.");
      return;
    }
    try {
      await resetDemoData();
      setResetMessage("Local demo data cleared.");
      setResetPending(false);
    } catch (error) {
      console.error("Could not clear demo data:", error);
      setResetMessage("Could not clear demo data. Please try again.");
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle
          eyebrow="Account"
          title="Profile"
          subtitle="Account, compliance, and support settings."
        />
        <DemoNotice />
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Demo investor</Text>
            <Text style={styles.profileEmail}>No account is signed in</Text>
          </View>
        </View>
        <Text style={styles.groupTitle}>ACCOUNT & SUPPORT</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <View
              key={item.title}
              style={[styles.menuRow, index < menuItems.length - 1 && styles.menuDivider]}
            >
              <View style={styles.menuCopy}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </View>
          ))}
        </View>
        <Text style={styles.groupTitle}>DEMO DATA</Text>
        <View style={styles.menuCard}>
          <Text style={styles.resetDescription}>
            Clear the simulated positions and activity stored on this device.
          </Text>
          <Text
            accessibilityRole="button"
            onPress={() => void handleReset()}
            style={[styles.resetAction, resetPending && styles.resetActionPending]}
          >
            {resetPending ? "Confirm clear demo data" : "Clear demo data"}
          </Text>
          {resetMessage ? <Text style={styles.resetMessage}>{resetMessage}</Text> : null}
        </View>
        <Text style={styles.footer}>
          This independent product demo is not affiliated with any property platform. No real assets,
          accounts, or financial services are provided.
        </Text>
      </ScrollView>
      <BottomNav active="/profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", padding: 20, paddingBottom: 24 },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.green, fontSize: 17, fontWeight: "800" },
  profileName: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  profileEmail: { color: colors.muted, fontSize: 11, marginTop: 4 },
  groupTitle: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.3, marginTop: 23, marginBottom: 9 },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 15,
  },
  menuRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  menuDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  menuCopy: { flex: 1 },
  menuTitle: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  menuDetail: { color: colors.muted, fontSize: 10, marginTop: 4 },
  menuArrow: { color: "#9AA29C", fontSize: 22 },
  resetDescription: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 14 },
  resetAction: { color: colors.coral, fontSize: 12, fontWeight: "700", marginTop: 13, marginBottom: 14 },
  resetActionPending: { color: "#8C3D30" },
  resetMessage: { color: colors.muted, fontSize: 10, marginBottom: 14 },
  footer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 20 },
});
