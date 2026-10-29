import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import type { Property } from "@/types";

export const colors = {
  ink: "#17241E",
  muted: "#78827B",
  green: "#1E684D",
  greenLight: "#E8F1EB",
  paper: "#F5F5F0",
  white: "#FFFFFF",
  line: "#E8E9E2",
  amber: "#F3C980",
  coral: "#B45C4A",
};

export function formatAed(amount: number) {
  return `AED ${Math.round(amount).toLocaleString("en-US")}`;
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.demoNotice, compact && styles.demoNoticeCompact]}>
      <Text style={styles.demoNoticeLabel}>DEMO MODE</Text>
      <Text style={styles.demoNoticeText}>
        Sample listings and figures only. No real investment or payment is made.
      </Text>
    </View>
  );
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${property.name}`}
      onPress={() => router.push({ pathname: "/property/[id]", params: { id: property.id } })}
      style={({ pressed }) => [styles.propertyCard, pressed && styles.pressed]}
    >
      <View style={styles.propertyImageWrap}>
        <Image source={{ uri: property.imageUrl }} style={styles.propertyImage} />
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{property.status}</Text>
        </View>
        <View style={styles.yieldPill}>
          <Text style={styles.yieldText}>{property.annualYieldPercent.toFixed(1)}% est.</Text>
        </View>
      </View>
      <View style={styles.propertyDetails}>
        <View style={styles.propertyNameRow}>
          <View style={styles.propertyCopy}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <Text style={styles.propertyLocation}>{property.location}</Text>
          </View>
          <Text style={styles.propertyPrice}>{formatAed(property.priceAed)}</Text>
        </View>
        <View style={styles.propertyFoot}>
          <Text style={styles.propertyMeta}>
            {property.bedrooms ? `${property.bedrooms} bed` : "Studio"} · {property.areaSqFt} sq ft
          </Text>
          <Text style={styles.propertyMin}>From {formatAed(property.minimumAed)}</Text>
        </View>
        <View style={styles.fundingTrack}>
          <View style={[styles.fundingProgress, { width: `${property.fundedPercent}%` }]} />
        </View>
        <Text style={styles.fundingText}>{property.fundedPercent}% sample allocation</Text>
      </View>
    </Pressable>
  );
}

const tabs = [
  { href: "/", label: "Explore", icon: "⌂" },
  { href: "/portfolio", label: "Portfolio", icon: "◫" },
  { href: "/activity", label: "Activity", icon: "↗" },
  { href: "/profile", label: "Profile", icon: "○" },
] as const;

export function BottomNav({ active }: { active: (typeof tabs)[number]["href"] }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => {
        const selected = tab.href === active;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={tab.href}
            onPress={() => router.replace(tab.href)}
            style={styles.navItem}
          >
            <Text style={[styles.navIcon, selected && styles.navSelected]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, selected && styles.navSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ScreenTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.screenTitle}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  demoNotice: {
    backgroundColor: "#F7EEDC",
    borderRadius: 13,
    paddingHorizontal: 13,
    paddingVertical: 11,
    gap: 3,
  },
  demoNoticeCompact: { paddingVertical: 9 },
  demoNoticeLabel: {
    color: "#835D24",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  demoNoticeText: { color: "#6E6048", fontSize: 12, lineHeight: 17 },
  propertyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ECEDE7",
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
  propertyImageWrap: { height: 185, backgroundColor: "#D8DDD5" },
  propertyImage: { width: "100%", height: "100%" },
  statusPill: {
    position: "absolute",
    top: 12,
    left: 12,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  statusText: { color: colors.ink, fontSize: 10, fontWeight: "700" },
  yieldPill: {
    position: "absolute",
    right: 12,
    bottom: 12,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: colors.ink,
  },
  yieldText: { color: colors.white, fontSize: 12, fontWeight: "700" },
  propertyDetails: { padding: 15 },
  propertyNameRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  propertyCopy: { flex: 1 },
  propertyName: { color: colors.ink, fontSize: 17, fontWeight: "700" },
  propertyLocation: { color: colors.muted, fontSize: 12, marginTop: 4 },
  propertyPrice: { color: colors.ink, fontSize: 12, fontWeight: "700" },
  propertyFoot: {
    marginTop: 15,
    marginBottom: 11,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  propertyMeta: { color: colors.muted, fontSize: 11 },
  propertyMin: { color: colors.green, fontSize: 11, fontWeight: "700" },
  fundingTrack: { height: 5, borderRadius: 4, backgroundColor: "#EEF0EA", overflow: "hidden" },
  fundingProgress: { height: "100%", borderRadius: 4, backgroundColor: colors.green },
  fundingText: { color: colors.muted, fontSize: 10, marginTop: 6 },
  bottomNav: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 10,
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    backgroundColor: colors.white,
    borderTopColor: colors.line,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navItem: { flex: 1, alignItems: "center", gap: 3 },
  navIcon: { color: "#89928C", fontSize: 20, lineHeight: 23 },
  navLabel: { color: "#89928C", fontSize: 10, fontWeight: "600" },
  navSelected: { color: colors.green, fontWeight: "800" },
  screenTitle: { gap: 5, marginBottom: 20 },
  eyebrow: { color: colors.green, fontSize: 10, fontWeight: "800", letterSpacing: 1.8 },
  title: { color: colors.ink, fontSize: 29, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: "700" },
  sectionAction: { color: colors.green, fontSize: 12, fontWeight: "700" },
});
