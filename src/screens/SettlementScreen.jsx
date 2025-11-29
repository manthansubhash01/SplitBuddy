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
import { createExpense } from "../api/expenseService";
import { CrumpledCard } from "../components/ui/CrumpledCard";
import { LucaButton } from "../components/ui/LucaButton";
import { PulseIcon } from "../components/ui/PulseIcon";
import { ArrowRight, CheckCircle, Sparkle } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettlementScreen({ navigation, route }) {
  const { getGroup, settleGroup, addExpenseToGroup } = useGroups();
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

  const { members, expenses, isSettled, payments = [] } = group;

  const balances = calculateBalances(expenses, members, payments);
  const settlements = calculateSettlements(balances, members);

  const getMemberName = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : "Unknown";
  };

  const handleMarkPaid = (settlement) => {
    Alert.alert(
      "Mark as Paid",
      `Confirm that ${getMemberName(
        settlement.from
      )} paid ₹${settlement.amount.toFixed(2)} to ${getMemberName(
        settlement.to
      )}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Paid",
          onPress: () => {
            addPayment(groupId, {
              from: settlement.from,
              to: settlement.to,
              amount: settlement.amount,
            });
            Alert.alert("Success", "Payment marked as complete!");
          },
        },
      ]
    );
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
            settlements.forEach((settlement) => {
              addPayment(groupId, {
                from: settlement.from,
                to: settlement.to,
                amount: settlement.amount,
              });
            });

            settleGroup(groupId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleMarkAsPaid = async (settlement) => {
    try {
      const expenseData = {
        title: "Settlement",
        amount: settlement.amount,
        payer: settlement.from,
        sharedMembers: [settlement.to],
        groupId,
        isPayment: true,
      };

      const createdExpense = await createExpense(expenseData);
      // We need to access addExpenseToGroup from context
      // But wait, useGroups returns it. Let's make sure we destructured it.
      // Yes, we did: const { getGroup, settleGroup } = useGroups();
      // Wait, we need addExpenseToGroup too.
      addExpenseToGroup(groupId, createdExpense);

      Alert.alert("Success", "Payment recorded!");
    } catch (error) {
      Alert.alert("Error", "Failed to record payment");
      console.error(error);
    }
  };

  const allSettled = settlements.length === 0 && expenses.length > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settlement Plan</Text>
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
                          ? theme.colors.oliveGreen
                          : isNegative
                            ? theme.colors.tomatoRed
                            : theme.colors.warmAsh,
                      },
                    ]}
                  >
                    {isPositive
                      ? `+$${balance.toFixed(0)}`
                      : isNegative
                        ? `-$${Math.abs(balance).toFixed(0)}`
                        : "Even"}
                  </Text>
                </View>

                <View style={styles.memberDetails}>
                  <Text style={styles.detailText}>
                    Paid: ${summary.totalPaid.toFixed(0)}
                  </Text>
                  <Text style={styles.detailText}>
                    Total Owed: ${summary.totalOwed.toFixed(0)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.balanceBar,
                    {
                      backgroundColor: isPositive
                        ? theme.colors.oliveGreen + "20" // 20% opacity
                        : isNegative
                          ? theme.colors.tomatoRed + "20"
                          : theme.colors.warmAsh + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.balanceBarText,
                      {
                        color: isPositive
                          ? theme.colors.oliveGreen
                          : isNegative
                            ? theme.colors.tomatoRed
                            : theme.colors.warmAsh,
                      },
                    ]}
                  >
                    {isPositive
                      ? `Should Receive $${balance.toFixed(2)}`
                      : isNegative
                        ? `Owes $${Math.abs(balance).toFixed(2)}`
                        : "Settled"}
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
                <View style={styles.cardHeader}>
                  <Text style={styles.amountText}>
                    ${settlement.amount.toFixed(0)}
                  </Text>
                </View>

                <View style={styles.namesContainer}>
                  <Text style={styles.nameText}>
                    {getMemberName(settlement.from)}
                  </Text>
                  <ArrowRight size={16} color={theme.colors.warmAsh} />
                  <Text style={styles.nameText}>
                    {getMemberName(settlement.to)}
                  </Text>
                </View>

                <LucaButton
                  title="Mark as Paid"
                  variant="secondary"
                  onPress={() => handleMarkAsPaid(settlement)}
                  style={styles.markPaidButton}
                  textStyle={styles.markPaidButtonText}
                />
              </CrumpledCard>
            ))}
          </View>
        )}

        {allSettled && (
          <View style={styles.celebrationContainer}>
            <PulseIcon>
              <Sparkle size={48} color={theme.colors.oliveGreen} weight="fill" />
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
    padding: 24,
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
    backgroundColor: theme.colors.oliveGreen,
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
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    alignItems: "flex-end",
  },
  namesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameText: {
    ...theme.typography.body,
    color: theme.colors.burntInk,
    fontFamily: "Syne_700Bold",
    fontSize: 22,
  },
  amountText: {
    ...theme.typography.display,
    fontSize: 24,
    color: theme.colors.tomatoRed,
  },
  markPaidButton: {
    height: 48,
    borderRadius: 24,
    width: "100%",
    marginTop: 4,
  },
  markPaidButtonText: {
    fontSize: 16,
    color: theme.colors.oliveGreen,
  },
  balanceBar: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  balanceBarText: {
    ...theme.typography.title2,
    fontSize: 14,
    fontFamily: "Syne_700Bold",
  },
  celebrationContainer: {
    alignItems: "center",
    padding: 32,
    gap: 16,
  },
  celebrationText: {
    ...theme.typography.display,
    fontSize: 24,
    color: theme.colors.oliveGreen,
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
