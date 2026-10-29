import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "@/context/AppContext";
import { colors, DemoNotice, formatAed, ScreenTitle } from "@/components/ui";

const QUICK_AMOUNTS = [500, 1000, 2500];

export default function DemoInvestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { properties, addDemoInvestment } = useAppContext();
  const property = properties.find((item) => item.id === id);
  const [amountText, setAmountText] = useState(property ? `${property.minimumAed}` : "500");
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const amount = Number(amountText.replace(/,/g, ""));
  const maxAmount = useMemo(
    () => (property ? Math.floor((property.priceAed * (100 - property.fundedPercent)) / 100) : 0),
    [property],
  );
  const validAmount =
    Number.isFinite(amount) &&
    amount >= (property?.minimumAed ?? Number.POSITIVE_INFINITY) &&
    amount <= maxAmount;
  const monthlyEstimate = property && validAmount ? (amount * property.annualYieldPercent) / 100 / 12 : 0;

  async function submitDemoRequest() {
    if (!property || !validAmount) {
      setError(`Enter an amount between ${formatAed(property?.minimumAed ?? 500)} and ${formatAed(maxAmount)}.`);
      setReviewing(false);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await addDemoInvestment(property.id, amount);
      router.replace("/portfolio");
    } catch (submitError) {
      console.error("Could not save demo investment:", submitError);
      setError("Could not save this demo request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!property) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.title}>Listing unavailable</Text>
          <Text onPress={() => router.replace("/")} style={styles.backLink}>Return to explore</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Back to property</Text>
        </Pressable>
        <ScreenTitle
          eyebrow="Simulated investment"
          title="Choose an amount"
          subtitle={`A demo contribution for ${property.name}. No payment will be taken.`}
        />
        <DemoNotice />
        <View style={styles.amountCard}>
          <Text style={styles.fieldLabel}>DEMO CONTRIBUTION (AED)</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencyMark}>AED</Text>
            <TextInput
              accessibilityLabel="Demo contribution amount in AED"
              keyboardType="number-pad"
              onChangeText={(text) => {
                setAmountText(text.replace(/[^\d]/g, ""));
                setError("");
                setReviewing(false);
              }}
              placeholder="500"
              placeholderTextColor="#A4AAA5"
              style={styles.amountInput}
              value={amountText}
            />
          </View>
          <Text style={styles.helperText}>
            Minimum {formatAed(property.minimumAed)} · Maximum demo amount {formatAed(maxAmount)}
          </Text>
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.filter((preset) => preset <= maxAmount).map((preset) => (
              <Pressable
                key={preset}
                onPress={() => {
                  setAmountText(`${preset}`);
                  setError("");
                  setReviewing(false);
                }}
                style={[styles.quickChip, amount === preset && styles.quickChipSelected]}
              >
                <Text style={[styles.quickText, amount === preset && styles.quickTextSelected]}>
                  {formatAed(preset)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.estimateCard}>
          <Text style={styles.estimateHeading}>Illustrative rental estimate</Text>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Estimated per month</Text>
            <Text style={styles.estimateValue}>{formatAed(monthlyEstimate)}</Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Illustrative annual yield</Text>
            <Text style={styles.estimateValue}>{property.annualYieldPercent.toFixed(1)}%</Text>
          </View>
          <Text style={styles.estimateFoot}>
            Fictional estimate for interface testing only—not a forecast or promise.
          </Text>
        </View>

        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {reviewing ? (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>This is only a simulation</Text>
            <Text style={styles.reviewText}>
              Confirming adds a local demo entry to your portfolio. It does not reserve a real unit, create
              ownership, or charge money.
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={() => void submitDemoRequest()}
              style={[styles.confirmButton, submitting && styles.disabled]}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Saving demo…" : "Confirm demo request"}
              </Text>
            </Pressable>
            <Text onPress={() => setReviewing(false)} style={styles.cancelText}>Go back</Text>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (!validAmount) {
                setError(`Enter an amount between ${formatAed(property.minimumAed)} and ${formatAed(maxAmount)}.`);
                return;
              }
              setReviewing(true);
              setError("");
            }}
            style={[styles.primaryButton, !validAmount && styles.primaryButtonMuted]}
          >
            <Text style={styles.primaryButtonText}>Review demo request</Text>
          </Pressable>
        )}
        <Text style={styles.legal}>
          Property investing carries risk, including loss of capital and illiquidity. This prototype is not
          a financial service and must not be used to accept real funds or orders.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.paper },
  content: { width: "100%", maxWidth: 540, alignSelf: "center", padding: 20, paddingBottom: 30 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 18 },
  backArrow: { color: colors.ink, fontSize: 24, lineHeight: 26 },
  backLabel: { color: colors.muted, fontSize: 12 },
  amountCard: { backgroundColor: colors.white, borderRadius: 18, padding: 17, marginTop: 16, borderColor: colors.line, borderWidth: 1 },
  fieldLabel: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },
  amountInputRow: { flexDirection: "row", alignItems: "center", borderBottomColor: colors.line, borderBottomWidth: 1, marginTop: 14, paddingBottom: 8 },
  currencyMark: { color: colors.green, fontSize: 15, fontWeight: "700", marginRight: 10 },
  amountInput: { flex: 1, color: colors.ink, fontSize: 30, fontWeight: "700", paddingVertical: 5 },
  helperText: { color: colors.muted, fontSize: 10, marginTop: 9 },
  quickAmounts: { flexDirection: "row", gap: 8, marginTop: 16 },
  quickChip: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 8 },
  quickChipSelected: { backgroundColor: colors.greenLight, borderColor: colors.green },
  quickText: { color: colors.muted, fontSize: 10, fontWeight: "600" },
  quickTextSelected: { color: colors.green },
  estimateCard: { backgroundColor: colors.white, borderRadius: 18, padding: 17, marginTop: 13, borderColor: colors.line, borderWidth: 1 },
  estimateHeading: { color: colors.ink, fontSize: 13, fontWeight: "700", marginBottom: 12 },
  estimateRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  estimateLabel: { color: colors.muted, fontSize: 11 },
  estimateValue: { color: colors.ink, fontSize: 11, fontWeight: "700" },
  estimateFoot: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 8 },
  error: { color: colors.coral, fontSize: 11, marginTop: 12 },
  primaryButton: { alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: colors.green, padding: 15, marginTop: 18 },
  primaryButtonMuted: { opacity: 0.72 },
  primaryButtonText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  reviewCard: { marginTop: 16, padding: 16, borderRadius: 16, backgroundColor: "#F7EEDC" },
  reviewTitle: { color: colors.ink, fontSize: 14, fontWeight: "700" },
  reviewText: { color: "#6E6048", fontSize: 11, lineHeight: 17, marginTop: 6 },
  confirmButton: { alignItems: "center", borderRadius: 13, backgroundColor: colors.green, padding: 14, marginTop: 13 },
  disabled: { opacity: 0.6 },
  cancelText: { color: colors.muted, textAlign: "center", padding: 12, fontSize: 11, fontWeight: "600" },
  legal: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 17 },
  notFound: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  backLink: { color: colors.green, marginTop: 16, fontWeight: "700" },
});
