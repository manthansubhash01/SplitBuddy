import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { useGroups } from "../context/GroupContext";
import { theme } from "../styles/theme";
import {
  calculateBalances,
  calculateSettlements,
  getMemberSummary,
} from "../utils/settlementCalculations";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { LucaButton } from "../components/ui/LucaButton";
import { PulseIcon } from "../components/ui/PulseIcon";
import { ArrowRight, CheckCircle, Sparkle } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettlementScreen({ navigation, route }) {
  const { getGroup, settleGroup } = useGroups();
  const { groupId } = route.params || {};
  const group = getGroup(groupId);
  const insets = useSafeAreaInsets();

  if (!group) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.oldReceipt }]}>
        <Text style={[styles.errorText, { color: theme.colors.aperitivoSpritz }]}>
          Group not found
        </Text>
      </View>
    );
  }

  const { members, expenses, isSettled } = group;

  // Calculate balances and settlements
  const balances = calculateBalances(expenses, members);
  const settlements = calculateSettlements(balances, members);

  // Get member name by ID
  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : "Unknown";
  };

  const handleSettleTrip = () => {
    Alert.alert(
      "Close the Circle?",
      "This will archive the trip. No turning back!",
      [
        { text: "Wait", style: "cancel" },
        {
          text: "Settle It",
          style: "destructive",
          onPress: () => {
            settleGroup(groupId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const allSettled = settlements.length === 0 && expenses.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settlements</Text>
        <Text style={styles.subtitle}>for {group.name}</Text>

        {isSettled && (
          <CrumpledCard style={styles.settledBadge}>
            <CheckCircle size={24} color={theme.colors.white} weight="fill" />
            <Text style={styles.settledText}>Trip Archived</Text>
          </CrumpledCard>
        )}

        {/* Member Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Member Balances</Text>

          {members.map((member) => {
            const summary = getMemberSummary(expenses, member.id);
            const balance = balances[member.id] || 0;
            const isPositive = balance > 0.01;
            const isNegative = balance < -0.01;

            return (
              <CrumpledCard key={member.id} style={styles.memberCard}>
                <View style={styles.memberHeader}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text
                    style={[
                      styles.netBalance,
                      {
                        color: isPositive
                          ? theme.colors.electricAmaro
                          : isNegative
                            ? theme.colors.aperitivoSpritz
                            : theme.colors.warmAsh,
                      },
                    ]}
                  >
                    {isPositive
                      ? `+₹${balance.toFixed(0)}`
                      : isNegative
                        ? `-₹${Math.abs(balance).toFixed(0)}`
                        : "Even"}
                  </Text>
                </View>

                <View style={styles.memberDetails}>
                  <Text style={styles.detailText}>
                    Paid: ₹{summary.totalPaid.toFixed(0)}
                  </Text>
                  <Text style={styles.detailText}>
                    Share: ₹{summary.totalOwed.toFixed(0)}
                  </Text>
                </View>
              </CrumpledCard>
            );
          })}
        </View>

        {/* Settlement Suggestions */}
        {settlements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Payments</Text>
            <Text style={styles.sectionSubtitle}>
              Minimal transfers to close the loop
            </Text>

            {settlements.map((settlement, index) => (
              <CrumpledCard key={index} style={styles.settlementCard}>
                <View style={styles.settlementRow}>
                  <Text style={styles.fromText}>
                    {getMemberName(settlement.from)}
                  </Text>
                  <ArrowRight size={20} color={theme.colors.warmAsh} />
                  <Text style={styles.toText}>
                    {getMemberName(settlement.to)}
                  </Text>
                </View>
                <Text style={styles.amountText}>
                  ₹{settlement.amount.toFixed(0)}
                </Text>
              </CrumpledCard>
            ))}
          </View>
        )}

        {allSettled && (
          <View style={styles.celebrationContainer}>
            <PulseIcon>
              <Sparkle size={48} color={theme.colors.electricAmaro} weight="fill" />
            </PulseIcon>
            <Text style={styles.celebrationText}>
              All even, you lucky bastards!
            </Text>
          </View>
        )}

        {expenses.length === 0 && (
          <CrumpledCard style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses yet.</Text>
            <Text style={styles.emptySubtext}>
              Did you guys just stare at each other?
            </Text>
          </CrumpledCard>
        )}
      </ScrollView>

      {/* Settle Trip Button */}
      {!isSettled && expenses.length > 0 && (
        <View style={styles.footer}>
          <LucaButton
            title="Settle Trip & Archive"
            onPress={handleSettleTrip}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.oldReceipt,
  },
  scrollContent: {
    padding: theme.spacing.settlementPadding,
    paddingBottom: 100,
  },
  title: {
    ...theme.typography.display,
    color: theme.colors.burntInk,
    marginBottom: 4,
  },
  subtitle: {
    ...theme.typography.title2,
    color: theme.colors.warmAsh,
    marginBottom: 24,
  },
  settledBadge: {
    backgroundColor: theme.colors.electricAmaro,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
    borderWidth: 0,
  },
  settledText: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    marginBottom: 12,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    marginBottom: 16,
  },
  memberCard: {
    marginBottom: 12,
    backgroundColor: theme.colors.white,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  memberName: {
    ...theme.typography.title2,
    fontSize: 18,
    color: theme.colors.burntInk,
  },
  netBalance: {
    ...theme.typography.title1,
    fontSize: 20,
  },
  memberDetails: {
    flexDirection: "row",
    gap: 16,
  },
  detailText: {
    ...theme.typography.caption,
    color: theme.colors.warmAsh,
  },
  settlementCard: {
    marginBottom: 12,
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settlementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  fromText: {
    ...theme.typography.body,
    color: theme.colors.burntInk,
    fontFamily: "Syne_700Bold",
  },
  toText: {
    ...theme.typography.body,
    color: theme.colors.burntInk,
    fontFamily: "Syne_700Bold",
  },
  amountText: {
    ...theme.typography.title1,
    color: theme.colors.aperitivoSpritz,
  },
  celebrationContainer: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  celebrationText: {
    ...theme.typography.display,
    fontSize: 24,
    color: theme.colors.electricAmaro,
    textAlign: "center",
    textShadowColor: theme.colors.burntInk,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    backgroundColor: theme.colors.white,
  },
  emptyText: {
    ...theme.typography.title2,
    color: theme.colors.burntInk,
    marginBottom: 8,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.warmAsh,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: theme.colors.oldReceipt,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  errorText: {
    ...theme.typography.title2,
    textAlign: "center",
    marginTop: 40,
  },
});
